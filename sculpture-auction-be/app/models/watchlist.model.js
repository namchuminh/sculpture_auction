const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const Watchlist = sequelize.define(
  "watchlist",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    auction_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "auctions", key: "id" },
    },
  },
  {
    tableName: "watchlist",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      { name: "idx_watchlist_user", fields: ["user_id"] },
      { name: "idx_watchlist_auction", fields: ["auction_id"] },
      { name: "uq_watchlist_user_auction", unique: true, fields: ["user_id", "auction_id"] },
    ],
  }
);

module.exports = Watchlist;
