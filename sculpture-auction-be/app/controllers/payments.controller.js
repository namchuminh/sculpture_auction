const sequelize = require("../config/db.config.js");
const { Payment, Order, Notification } = require("../models/index.js");

class PaymentsController {
    async createForOrder(req, res) {
        const orderId = Number(req.params.orderId);
        const { method } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.buyer_id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        const payment = await Payment.create({
            order_id: order.id,
            amount: order.total_amount,
            method: method && ["COD", "BANK_TRANSFER", "CREDIT_CARD", "OTHER"].includes(method) ? method : "OTHER",
            status: "PENDING",
            transaction_code: null,
            paid_at: null,
        });

        return res.status(201).json({ payment });
    }

    async listForOrder(req, res) {
        const orderId = Number(req.params.orderId);
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (req.user.role !== "ADMIN" && order.buyer_id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        const payments = await Payment.findAll({ where: { order_id: orderId }, order: [["createdAt", "DESC"]] });
        return res.json({ payments });
    }

    async complete(req, res) {
        const { status, transaction_code } = req.body;
        if (!["SUCCESS", "FAILED"].includes(status)) return res.status(400).json({ message: "Invalid status" });

        const t = await sequelize.transaction();
        try {
            const payment = await Payment.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!payment) {
                await t.rollback();
                return res.status(404).json({ message: "Not found" });
            }

            await payment.update(
                {
                    status,
                    transaction_code: transaction_code || payment.transaction_code,
                    paid_at: status === "SUCCESS" ? new Date() : null,
                },
                { transaction: t }
            );

            const order = await Order.findByPk(payment.order_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (status === "SUCCESS") {
                await order.update({ status: "PAID" }, { transaction: t });

                await Notification.create(
                    { user_id: order.buyer_id, title: "Thanh toán thành công", content: `Đơn #${order.id} đã được thanh toán.`, type: "PAYMENT_SUCCESS", is_read: 0 },
                    { transaction: t }
                );
            } else {
                await Notification.create(
                    { user_id: order.buyer_id, title: "Thanh toán thất bại", content: `Đơn #${order.id} thanh toán thất bại.`, type: "PAYMENT_FAILED", is_read: 0 },
                    { transaction: t }
                );
            }

            await t.commit();
            return res.json({ payment, order });
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    async listAll(req, res) {
        const payments = await Payment.findAll({ order: [["createdAt", "DESC"]] });
        return res.json({ payments });
    }
}

module.exports = new PaymentsController();
