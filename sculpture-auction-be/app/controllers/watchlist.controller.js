const { Watchlist, Auction, Sculpture } = require("../models/index.js");

class WatchlistController {
    async list(req, res) {
        const items = await Watchlist.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: Auction,
                    as: "auction",
                    include: [{ model: Sculpture, as: "sculpture" }],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return res.json({ items });
    }

    async add(req, res) {
        const auction_id = Number(req.body.auction_id);
        if (!auction_id) return res.status(400).json({ message: "auction_id required" });

        const existed = await Watchlist.findOne({ where: { user_id: req.user.id, auction_id } });
        if (existed) return res.json({ item: existed });

        const item = await Watchlist.create({ user_id: req.user.id, auction_id });
        return res.status(201).json({ item });
    }

    async remove(req, res) {
        const auction_id = Number(req.params.auctionId);
        await Watchlist.destroy({ where: { user_id: req.user.id, auction_id } });
        return res.json({ message: "Deleted" });
    }
}

module.exports = new WatchlistController();
