const { Op } = require("sequelize");
const sequelize = require("../config/db.config.js");
const { Auction, Bid, Notification, User } = require("../models/index.js");

class BidsController {
    async placeBid(req, res) {
        const auctionId = Number(req.params.auctionId);
        const amount = Number(req.body.amount);

        if (!amount || Number.isNaN(amount)) return res.status(400).json({ message: "amount required" });

        const t = await sequelize.transaction();
        try {
            const auction = await Auction.findByPk(auctionId, { transaction: t, lock: t.LOCK.UPDATE });
            if (!auction) {
                await t.rollback();
                return res.status(404).json({ message: "Auction not found" });
            }

            if (auction.status !== "OPEN") {
                await t.rollback();
                return res.status(400).json({ message: "Auction not OPEN" });
            }

            const now = new Date();
            if (now < new Date(auction.start_time) || now > new Date(auction.end_time)) {
                await t.rollback();
                return res.status(400).json({ message: "Out of auction time" });
            }

            const min = Number(auction.current_price) + Number(auction.bid_step);
            if (amount < min) {
                await t.rollback();
                return res.status(400).json({ message: `amount must be >= ${min}` });
            }

            // bidder trước đó (đang giữ top VALID)
            const prevTop = await Bid.findOne({
                where: { auction_id: auction.id, status: "VALID" },
                order: [["amount", "DESC"], ["createdAt", "ASC"]],
                transaction: t,
                lock: t.LOCK.UPDATE,
            });

            // outbid tất cả VALID cũ
            await Bid.update(
                { status: "OUTBID" },
                { where: { auction_id: auction.id, status: "VALID" }, transaction: t }
            );

            const bid = await Bid.create(
                { auction_id: auction.id, bidder_id: req.user.id, amount, status: "VALID" },
                { transaction: t }
            );

            await auction.update({ current_price: amount }, { transaction: t });

            // notify prevTop bidder
            if (prevTop && prevTop.bidder_id !== req.user.id) {
                await Notification.create(
                    {
                        user_id: prevTop.bidder_id,
                        title: "Bạn đã bị vượt giá",
                        content: `Phiên #${auction.id} vừa có người đặt giá cao hơn.`,
                        type: "OUTBID",
                        is_read: 0,
                    },
                    { transaction: t }
                );
            }

            // notify seller
            await Notification.create(
                {
                    user_id: auction.seller_id,
                    title: "Có lượt đặt giá mới",
                    content: `Phiên #${auction.id} vừa có bid mới.`,
                    type: "NEW_BID",
                    is_read: 0,
                },
                { transaction: t }
            );

            await t.commit();

            const bidder = await User.findByPk(req.user.id, { attributes: ["id", "full_name"] });
            return res.status(201).json({ bid: { ...bid.toJSON(), bidder } });
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    async myBids(req, res) {
        const bids = await Bid.findAll({
            where: { bidder_id: req.user.id },
            order: [["createdAt", "DESC"]],
        });
        return res.json({ bids });
    }
}

module.exports = new BidsController();
