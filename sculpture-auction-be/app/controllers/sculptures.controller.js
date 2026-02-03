const { Op } = require("sequelize");
const { Sculpture, SculptureImage, User, Category, Auction, Review } = require("../models/index.js");

class SculpturesController {
    async list(req, res) {
        const {
            status, category_id, material, year_created, q,
            sort = "createdAt", order = "DESC",
            page = 1, limit = 12
        } = req.query;

        const where = {};
        if (status) where.status = status;
        else where.status = { [Op.in]: ["PUBLISHED", "SOLD"] }; // guest theo đặc tả

        if (category_id) where.category_id = Number(category_id);
        if (material) where.material = material;
        if (year_created) where.year_created = Number(year_created);
        if (q) where.title = { [Op.like]: `%${q}%` };

        const p = Math.max(1, Number(page));
        const l = Math.min(100, Math.max(1, Number(limit)));
        const offset = (p - 1) * l;

        const { rows, count } = await Sculpture.findAndCountAll({
            where,
            include: [
                { model: Category },
                { model: User, as: "artist", attributes: ["id", "full_name", "avatar_url"] },
                { model: SculptureImage, as: "images", separate: true, limit: 6, order: [["sort_order", "ASC"], ["id", "ASC"]] },
            ],
            order: [[sort, order]],
            limit: l,
            offset,
        });

        return res.json({ items: rows, total: count, page: p, limit: l });
    }

    async detail(req, res) {
        const sculpture = await Sculpture.findByPk(req.params.id, {
            include: [
                { model: Category },
                { model: User, as: "artist", attributes: ["id", "full_name", "avatar_url", "bio"] },
                { model: SculptureImage, as: "images", order: [["sort_order", "ASC"], ["id", "ASC"]] },
            ],
        });
        if (!sculpture) return res.status(404).json({ message: "Not found" });

        // auction đang SCHEDULED/OPEN để hiển thị ở chi tiết
        const auction = await Auction.findOne({
            where: { sculpture_id: sculpture.id, status: { [Op.in]: ["SCHEDULED", "OPEN"] } },
            order: [["id", "DESC"]],
            include: [{ model: User, as: "seller", attributes: ["id", "full_name"] }],
        });

        return res.json({ sculpture, auction });
    }

    async create(req, res) {
        const { title, description, material, dimensions, weight, year_created, category_id, status } = req.body;
        if (!title) return res.status(400).json({ message: "title required" });

        // artist_id là người đăng nhập (trừ admin muốn nhập tay cũng được)
        const artist_id = req.user.role === "ADMIN" && req.body.artist_id ? Number(req.body.artist_id) : req.user.id;

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const sculpture = await Sculpture.create({
            artist_id,
            category_id: category_id ? Number(category_id) : null,
            title,
            description: description || null,
            material: material || null,
            dimensions: dimensions || null,
            weight: weight !== undefined ? Number(weight) : null,
            year_created: year_created ? Number(year_created) : null,
            image_url,
            status: status && ["DRAFT", "PUBLISHED", "HIDDEN", "SOLD"].includes(status) ? status : "DRAFT",
        });

        return res.status(201).json({ sculpture });
    }

    async update(req, res) {
        const sculpture = await Sculpture.findByPk(req.params.id);
        if (!sculpture) return res.status(404).json({ message: "Not found" });

        // artist sở hữu hoặc admin
        if (req.user.role !== "ADMIN" && sculpture.artist_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { title, description, material, dimensions, weight, year_created, category_id } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : sculpture.image_url;

        await sculpture.update({
            title: title ?? sculpture.title,
            description: description ?? sculpture.description,
            material: material ?? sculpture.material,
            dimensions: dimensions ?? sculpture.dimensions,
            weight: weight !== undefined ? Number(weight) : sculpture.weight,
            year_created: year_created !== undefined ? Number(year_created) : sculpture.year_created,
            category_id: category_id !== undefined ? (category_id ? Number(category_id) : null) : sculpture.category_id,
            image_url,
        });

        return res.json({ sculpture });
    }

    async setStatus(req, res) {
        const sculpture = await Sculpture.findByPk(req.params.id);
        if (!sculpture) return res.status(404).json({ message: "Not found" });

        if (req.user.role !== "ADMIN" && sculpture.artist_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { status } = req.body;
        if (!["DRAFT", "PUBLISHED", "HIDDEN", "SOLD"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        await sculpture.update({ status });
        return res.json({ sculpture });
    }

    async listImages(req, res) {
        const images = await SculptureImage.findAll({
            where: { sculpture_id: req.params.id },
            order: [["is_primary", "DESC"], ["sort_order", "ASC"], ["id", "ASC"]],
        });
        return res.json({ images });
    }

    async listReviews(req, res) {
        const reviews = await Review.findAll({
            where: { sculpture_id: req.params.id },
            include: [{ model: User, as: "user", attributes: ["id", "full_name", "avatar_url"] }],
            order: [["createdAt", "DESC"]],
        });
        return res.json({ reviews });
    }
}

module.exports = new SculpturesController();
