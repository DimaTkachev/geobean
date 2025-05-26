const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Continent = sequelize.define(
  "Continent",
  {
    continentID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  },
  {
    tableName: "continent",
    timestamps: true,
  }
);

module.exports = Continent;
