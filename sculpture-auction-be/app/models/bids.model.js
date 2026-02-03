const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const Bid = sequelize.define(
  "bid",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    auction_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "auctions", key: "id" },
    },
    bidder_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("VALID", "OUTBID", "CANCELLED"),
      allowNull: false,
      defaultValue: "VALID",
    },
  },
  {
    tableName: "bids",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Bid;
