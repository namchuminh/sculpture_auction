const bcrypt = require("bcryptjs");
const { User } = require("../models/index.js");
const { signToken } = require("../middleware/auth.middleware.js");

class AuthController {
    async register(req, res) {
        const { email, password, full_name } = req.body;

        if (!email || !password) return res.status(400).json({ message: "email/password required" });
        if (String(password).length < 6) return res.status(400).json({ message: "password min 6" });

        const existed = await User.findOne({ where: { email } });
        if (existed) return res.status(409).json({ message: "Email already exists" });

        const password_hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password_hash,
            full_name: full_name || null,
            role: "USER",
            is_active: 1,
        });

        const token = signToken({ id: user.id, role: user.role });
        return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }

    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "email/password required" });

        const user = await User.findOne({ where: { email } });
        if (!user || user.is_active !== 1) return res.status(401).json({ message: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });

        const token = signToken({ id: user.id, role: user.role });
        return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }

    async me(req, res) {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ["password_hash"] },
        });
        return res.json({ user });
    }
}

module.exports = new AuthController();
