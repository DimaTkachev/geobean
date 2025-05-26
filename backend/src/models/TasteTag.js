const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TasteTag = sequelize.define(
  "TasteTag",
  {
    tagID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    tableName: "taste_tag",
    timestamps: true,
  }
);

module.exports = TasteTag;
