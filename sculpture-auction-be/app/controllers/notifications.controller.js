const { Notification } = require("../models/index.js");

class NotificationsController {
    async listMe(req, res) {
        const items = await Notification.findAll({
            where: { user_id: req.user.id },
            order: [["createdAt", "DESC"]],
        });
        return res.json({ notifications: items });
    }

    async markRead(req, res) {
        const n = await Notification.findByPk(req.params.id);
        if (!n) return res.status(404).json({ message: "Not found" });
        if (n.user_id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        await n.update({ is_read: 1 });
        return res.json({ notification: n });
    }

    async readAll(req, res) {
        await Notification.update({ is_read: 1 }, { where: { user_id: req.user.id } });
        return res.json({ message: "OK" });
    }
}

module.exports = new NotificationsController();
