const { Op } = require("sequelize");
const { Order, Auction, Sculpture, User, Payment, Notification } = require("../models/index.js");

class OrdersController {
    async myOrders(req, res) {
        const orders = await Order.findAll({
            where: { buyer_id: req.user.id },
            include: [{ model: Auction, as: "auction" }, { model: Sculpture, as: "sculpture" }],
            order: [["createdAt", "DESC"]],
        });
        return res.json({ orders });
    }

    async artistOrders(req, res) {
        const orders = await Order.findAll({
            include: [
                {
                    model: Sculpture,
                    as: "sculpture",
                    where: { artist_id: req.user.id },
                    required: true,
                },
                { model: Auction, as: "auction" },
                { model: User, as: "buyer", attributes: ["id", "full_name", "email"] },
            ],
            order: [["createdAt", "DESC"]],
        });
        return res.json({ orders });
    }

    async listAll(req, res) {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;

        const orders = await Order.findAll({
            where,
            include: [
                { model: User, as: "buyer", attributes: ["id", "full_name", "email"] },
                { model: Auction, as: "auction" },
                { model: Sculpture, as: "sculpture" },
                { model: Payment, as: "payments" },
            ],
            order: [["createdAt", "DESC"]],
        });
        return res.json({ orders });
    }

    async detail(req, res) {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, as: "buyer", attributes: ["id", "full_name", "email"] },
                { model: Auction, as: "auction" },
                { model: Sculpture, as: "sculpture" },
                { model: Payment, as: "payments" },
            ],
        });
        if (!order) return res.status(404).json({ message: "Not found" });

        const isOwner = order.buyer_id === req.user.id;
        let isArtist = false;
        if (!isOwner && req.user.role === "ARTIST") {
            const sc = await Sculpture.findByPk(order.sculpture_id);
            isArtist = sc && sc.artist_id === req.user.id;
        }

        if (req.user.role !== "ADMIN" && !isOwner && !isArtist) {
            return res.status(403).json({ message: "Forbidden" });
        }

        return res.json({ order });
    }

    async updateShippingAddress(req, res) {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: "Not found" });

        if (order.buyer_id !== req.user.id) return res.status(403).json({ message: "Forbidden" });
        if (order.status !== "PENDING") return res.status(400).json({ message: "Only PENDING can update shipping" });

        const { shipping_address } = req.body;
        if (!shipping_address) return res.status(400).json({ message: "shipping_address required" });

        await order.update({ shipping_address });
        return res.json({ order });
    }

    async updateStatus(req, res) {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: "Not found" });

        const { status } = req.body;
        if (!["PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        await order.update({ status });

        await Notification.create({
            user_id: order.buyer_id,
            title: "Cập nhật trạng thái đơn hàng",
            content: `Đơn #${order.id} chuyển sang trạng thái ${status}.`,
            type: "ORDER_STATUS",
            is_read: 0,
        });

        return res.json({ order });
    }
}

module.exports = new OrdersController();
