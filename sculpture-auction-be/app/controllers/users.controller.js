const bcrypt = require("bcryptjs");
const { User } = require("../models/index.js");

class UsersController {
  async me(req, res) {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password_hash"] } });
    return res.json({ user });
  }

  async updateMe(req, res) {
    const { full_name, phone, address, bio } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let avatar_url = user.avatar_url;
    if (req.file) avatar_url = `/uploads/${req.file.filename}`;

    await user.update({
      full_name: full_name ?? user.full_name,
      phone: phone ?? user.phone,
      address: address ?? user.address,
      bio: bio ?? user.bio,
      avatar_url,
    });

    const out = await User.findByPk(req.user.id, { attributes: { exclude: ["password_hash"] } });
    return res.json({ user: out });
  }

  async changePassword(req, res) {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) return res.status(400).json({ message: "old/new required" });
    if (String(new_password).length < 6) return res.status(400).json({ message: "password min 6" });

    const user = await User.findByPk(req.user.id);
    const ok = await bcrypt.compare(old_password, user.password_hash);
    if (!ok) return res.status(400).json({ message: "Old password incorrect" });

    const password_hash = await bcrypt.hash(new_password, 10);
    await user.update({ password_hash });

    return res.json({ message: "Password updated" });
  }

  // admin
  async list(req, res) {
    const { email, role, is_active } = req.query;
    const where = {};
    if (email) where.email = email;
    if (role) where.role = role;
    if (is_active !== undefined) where.is_active = Number(is_active);

    const users = await User.findAll({ where, attributes: { exclude: ["password_hash"] } });
    return res.json({ users });
  }

  async detail(req, res) {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password_hash"] } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  }

  async setActive(req, res) {
    const { is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ is_active: Number(is_active) ? 1 : 0 });
    return res.json({ message: "OK" });
  }

  async setRole(req, res) {
    const { role } = req.body;
    if (!["ADMIN", "ARTIST", "USER"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ role });
    return res.json({ message: "OK" });
  }
}

module.exports = new UsersController();
