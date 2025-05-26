const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Supplier = sequelize.define(
  "Supplier",
  {
    supplierID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(50), allowNull: false },
    url: { type: DataTypes.STRING(1024) },
  },
  {
    tableName: "supplier",
    timestamps: true,
  }
);

module.exports = Supplier;
