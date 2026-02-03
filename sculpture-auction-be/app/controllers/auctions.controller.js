const { Op } = require("sequelize");
const sequelize = require("../config/db.config.js");
const { Auction, Sculpture, User, Bid, Order, Notification } = require("../models/index.js");

class AuctionsController {
    async list(req, res) {
        const { status, q, page = 1, limit = 12 } = req.query;
        const where = {};
        if (status) where.status = status;

        const p = Math.max(1, Number(page));
        const l = Math.min(100, Math.max(1, Number(limit)));
        const offset = (p - 1) * l;

        const include = [
            {
                model: Sculpture,
                as: "sculpture",
                where: q ? { title: { [Op.like]: `%${q}%` } } : undefined,
                required: q ? true : false,
            },
            { model: User, as: "seller", attributes: ["id", "full_name"] },
            { model: User, as: "winner", attributes: ["id", "full_name"] },
        ];

        const { rows, count } = await Auction.findAndCountAll({
            where,
            include,
            order: [["createdAt", "DESC"]],
            limit: l,
            offset,
        });

        return res.json({ items: rows, total: count, page: p, limit: l });
    }

    async detail(req, res) {
        const auction = await Auction.findByPk(req.params.id, {
            include: [
                { model: Sculpture, as: "sculpture" },
                { model: User, as: "seller", attributes: ["id", "full_name"] },
                { model: User, as: "winner", attributes: ["id", "full_name"] },
            ],
        });
        if (!auction) return res.status(404).json({ message: "Not found" });

        const bids = await Bid.findAll({
            where: { auction_id: auction.id },
            order: [["amount", "DESC"], ["createdAt", "DESC"]],
            limit: 50,
            include: [{ model: User, as: "bidder", attributes: ["id", "full_name"] }],
        });

        return res.json({ auction, bids });
    }

    async myAuctions(req, res) {
        const auctions = await Auction.findAll({
            where: { seller_id: req.user.id },
            include: [{ model: Sculpture, as: "sculpture" }],
            order: [["createdAt", "DESC"]],
        });
        return res.json({ auctions });
    }

    async create(req, res) {
        const { sculpture_id, start_price, bid_step, buy_now_price, start_time, end_time } = req.body;
        if (!sculpture_id || !start_price || !bid_step || !start_time || !end_time) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const sculpture = await Sculpture.findByPk(sculpture_id);
        if (!sculpture) return res.status(404).json({ message: "Sculpture not found" });

        if (req.user.role !== "ADMIN" && sculpture.artist_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const seller_id = req.user.role === "ADMIN" && req.body.seller_id ? Number(req.body.seller_id) : req.user.id;

        const auction = await Auction.create({
            sculpture_id: Number(sculpture_id),
            seller_id,
            start_price: Number(start_price),
            current_price: Number(start_price),
            bid_step: Number(bid_step),
            buy_now_price: buy_now_price !== undefined && buy_now_price !== null ? Number(buy_now_price) : null,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            status: "SCHEDULED",
            winner_id: null,
        });

        return res.status(201).json({ auction });
    }

    async updateScheduled(req, res) {
        const auction = await Auction.findByPk(req.params.id);
        if (!auction) return res.status(404).json({ message: "Not found" });

        if (req.user.role !== "ADMIN" && auction.seller_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (auction.status !== "SCHEDULED") return res.status(400).json({ message: "Only SCHEDULED can be updated" });

        const { start_price, bid_step, buy_now_price, start_time, end_time } = req.body;

        await auction.update({
            start_price: start_price !== undefined ? Number(start_price) : auction.start_price,
            bid_step: bid_step !== undefined ? Number(bid_step) : auction.bid_step,
            buy_now_price: buy_now_price !== undefined ? (buy_now_price === null ? null : Number(buy_now_price)) : auction.buy_now_price,
            start_time: start_time !== undefined ? new Date(start_time) : auction.start_time,
            end_time: end_time !== undefined ? new Date(end_time) : auction.end_time,
        });

        // nếu sửa start_price mà chưa có bid, đồng bộ current_price
        const bidCount = await Bid.count({ where: { auction_id: auction.id } });
        if (bidCount === 0 && start_price !== undefined) {
            await auction.update({ current_price: Number(start_price) });
        }

        return res.json({ auction });
    }

    async cancel(req, res) {
        const auction = await Auction.findByPk(req.params.id);
        if (!auction) return res.status(404).json({ message: "Not found" });

        await auction.update({ status: "CANCELLED" });
        return res.json({ message: "Cancelled" });
    }

    // đóng phiên -> set winner + tạo order PENDING + notify
    async closeAuction(req, res) {
        const t = await sequelize.transaction();
        try {
            const auction = await Auction.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!auction) {
                await t.rollback();
                return res.status(404).json({ message: "Not found" });
            }

            if (req.user.role !== "ADMIN" && auction.seller_id !== req.user.id) {
                await t.rollback();
                return res.status(403).json({ message: "Forbidden" });
            }

            if (auction.status !== "OPEN" && auction.status !== "SCHEDULED") {
                await t.rollback();
                return res.status(400).json({ message: "Invalid status to close" });
            }

            const topBid = await Bid.findOne({
                where: { auction_id: auction.id, status: "VALID" },
                order: [["amount", "DESC"], ["createdAt", "ASC"]],
                transaction: t,
                lock: t.LOCK.UPDATE,
            });

            if (!topBid) {
                await auction.update({ status: "CLOSED", winner_id: null }, { transaction: t });
                await t.commit();
                return res.json({ message: "Closed without bids", auction });
            }

            await auction.update({ status: "CLOSED", winner_id: topBid.bidder_id, current_price: topBid.amount }, { transaction: t });

            // tạo order (nếu chưa tạo)
            const existedOrder = await Order.findOne({ where: { auction_id: auction.id }, transaction: t });
            if (!existedOrder) {
                await Order.create(
                    {
                        buyer_id: topBid.bidder_id,
                        auction_id: auction.id,
                        sculpture_id: auction.sculpture_id,
                        total_amount: topBid.amount,
                        shipping_address: "",
                        status: "PENDING",
                    },
                    { transaction: t }
                );
            }

            // notify winner + seller
            await Notification.create(
                { user_id: topBid.bidder_id, title: "Bạn đã thắng đấu giá", content: `Phiên #${auction.id} đã kết thúc.`, type: "AUCTION_WON", is_read: 0 },
                { transaction: t }
            );
            await Notification.create(
                { user_id: auction.seller_id, title: "Phiên đấu giá đã kết thúc", content: `Phiên #${auction.id} đã có người thắng.`, type: "AUCTION_CLOSED", is_read: 0 },
                { transaction: t }
            );

            await t.commit();
            return res.json({ message: "Closed", auction });
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
}

module.exports = new AuctionsController();
