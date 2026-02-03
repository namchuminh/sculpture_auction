const { Sculpture, SculptureImage } = require("../models/index.js");

class SculptureImagesController {
    async addMany(req, res) {
        const sculptureId = Number(req.params.sculptureId);
        const sculpture = await Sculpture.findByPk(sculptureId);
        if (!sculpture) return res.status(404).json({ message: "Sculpture not found" });

        if (req.user.role !== "ADMIN" && sculpture.artist_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const files = req.files || [];
        if (!files.length) return res.status(400).json({ message: "No images" });

        const created = [];
        for (const f of files) {
            created.push(
                await SculptureImage.create({
                    sculpture_id: sculptureId,
                    url: `/uploads/${f.filename}`,
                    sort_order: 0,
                    is_primary: 0,
                })
            );
        }

        return res.status(201).json({ images: created });
    }

    async updateMeta(req, res) {
        const img = await SculptureImage.findByPk(req.params.id);
        if (!img) return res.status(404).json({ message: "Not found" });

        const sculpture = await Sculpture.findByPk(img.sculpture_id);
        if (!sculpture) return res.status(404).json({ message: "Sculpture not found" });

        if (req.user.role !== "ADMIN" && sculpture.artist_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { sort_order, is_primary } = req.body;

        if (is_primary === 1 || is_primary === "1" || is_primary === true) {
            await SculptureImage.update(
                { is_primary: 0 },
                { where: { sculpture_id: img.sculpture_id } }
            );
        }

        await img.update({
            sort_order: sort_order !== undefined ? Number(sort_order) : img.sort_order,
            is_primary: is_primary !== undefined ? (Number(is_primary) ? 1 : 0) : img.is_primary,
        });

        return res.json({ image: img });
    }

    async remove(req, res) {
        const img = await SculptureImage.findByPk(req.params.id);
        if (!img) return res.status(404).json({ message: "Not found" });

        const sculpture = await Sculpture.findByPk(img.sculpture_id);
        if (!sculpture) return res.status(404).json({ message: "Sculpture not found" });

        if (req.user.role !== "ADMIN" && sculpture.artist_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await img.destroy();
        return res.json({ message: "Deleted" });
    }
}

module.exports = new SculptureImagesController();
