const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Weight = sequelize.define(
  "Weight",
  {
    weightID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: { type: DataTypes.STRING(20), allowNull: false },
  },
  {
    tableName: "weight",
    timestamps: true,
  }
);

module.exports = Weight;
