const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const SculptureImage = sequelize.define(
  "sculpture_image",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    sculpture_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "sculptures", key: "id" },
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_primary: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "sculpture_images",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      { name: "idx_sculpture_images_sculpture_id", fields: ["sculpture_id"] },
      { name: "idx_sculpture_images_primary", fields: ["sculpture_id", "is_primary"] },
    ],
  }
);

module.exports = SculptureImage;
