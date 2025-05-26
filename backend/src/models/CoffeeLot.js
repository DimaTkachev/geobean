const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CoffeeLot = sequelize.define(
  "CoffeeLot",
  {
    lotID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100) },
    description: { type: DataTypes.TEXT },
    regionID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    taste: { type: DataTypes.TEXT },
    tasteFilter: { type: DataTypes.TEXT },
    qRate: { type: DataTypes.FLOAT },
    roastingID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    methodID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    supplierID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    height: { type: DataTypes.STRING(20) },
    weightID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    image: { type: DataTypes.STRING(255) },
    link: { type: DataTypes.STRING(1024) },
  },
  {
    tableName: "coffee_lot",
    timestamps: true,
  }
);

module.exports = CoffeeLot;
