const express = require("express");
const path = require("path");
const cors = require("cors");

const route = require("./app/routes/index.js");
const sequelize = require("./app/config/db.config.js");
require("./app/models/index.js");

const app = express();

// CORS: allow all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Preflight
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

route(app);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (e) {
    console.error("DB connect failed:", e);
    process.exit(1);
  }
})();
