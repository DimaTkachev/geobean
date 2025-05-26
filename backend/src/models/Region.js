const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Region = sequelize.define(
  "Region",
  {
    regionID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    countryID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    tableName: "region",
    timestamps: true,
  }
);

module.exports = Region;
