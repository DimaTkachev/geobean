const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CoffeeLotTag = sequelize.define(
  "CoffeeLotTag",
  {
    lotID: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    tagID: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
  },
  {
    tableName: "coffee_lot_tag",
    timestamps: false,
  }
);

module.exports = CoffeeLotTag;
