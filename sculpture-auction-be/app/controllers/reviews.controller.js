const { Review, Order, Sculpture, User } = require("../models/index.js");

class ReviewsController {
    async createForOrder(req, res) {
        const orderId = Number(req.params.orderId);
        const { rating, comment } = req.body;

        const r = Number(rating);
        if (!r || r < 1 || r > 5) return res.status(400).json({ message: "rating 1..5" });

        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.buyer_id !== req.user.id) return res.status(403).json({ message: "Forbidden" });
        if (order.status !== "COMPLETED") return res.status(400).json({ message: "Only COMPLETED can review" });

        const existed = await Review.findOne({ where: { order_id: order.id, user_id: req.user.id } });
        if (existed) return res.status(409).json({ message: "Already reviewed" });

        const review = await Review.create({
            order_id: order.id,
            sculpture_id: order.sculpture_id,
            user_id: req.user.id,
            rating: r,
            comment: comment || null,
        });

        return res.status(201).json({ review });
    }

    async listAll(req, res) {
        const { sculpture_id, user_id, rating } = req.query;
        const where = {};
        if (sculpture_id) where.sculpture_id = Number(sculpture_id);
        if (user_id) where.user_id = Number(user_id);
        if (rating) where.rating = Number(rating);

        const reviews = await Review.findAll({
            where,
            include: [
                { model: User, as: "user", attributes: ["id", "full_name", "email"] },
                { model: Sculpture, as: "sculpture" },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.json({ reviews });
    }
}

module.exports = new ReviewsController();
