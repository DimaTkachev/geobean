const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Country = sequelize.define(
  "Country",
  {
    countryID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(60), unique: true, allowNull: false },
    iso3: { type: DataTypes.STRING(3), unique: true, allowNull: false },
    continentID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    tableName: "country",
    timestamps: true,
  }
);

module.exports = Country;
