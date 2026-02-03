const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js");

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME_SECRET";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function requireAuth(req, res, next) {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user || user.is_active !== 1) return res.status(401).json({ message: "Unauthorized" });

        req.user = { id: user.id, role: user.role };
        return next();
    } catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
        return next();
    };
}

module.exports = { signToken, requireAuth, requireRole };
