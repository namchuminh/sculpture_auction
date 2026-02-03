const { Category } = require("../models/index.js");

class CategoriesController {
    async list(req, res) {
        const categories = await Category.findAll();
        return res.json({ categories });
    }

    async detail(req, res) {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: "Not found" });
        return res.json({ category });
    }

    async create(req, res) {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "name required" });

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        const category = await Category.create({ name, description: description || null, image_url });
        return res.status(201).json({ category });
    }

    async update(req, res) {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: "Not found" });

        const { name, description } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : category.image_url;

        await category.update({
            name: name ?? category.name,
            description: description ?? category.description,
            image_url,
        });

        return res.json({ category });
    }

    async remove(req, res) {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: "Not found" });

        await category.destroy();
        return res.json({ message: "Deleted" });
    }
}

module.exports = new CategoriesController();
