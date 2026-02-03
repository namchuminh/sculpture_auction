// app/models/orders.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    buyer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    auction_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "auctions", key: "id" },
    },
    sculpture_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "sculptures", key: "id" },
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Order;
