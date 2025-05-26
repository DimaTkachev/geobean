const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Marker = sequelize.define(
  "Marker",
  {
    markerID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    lotID: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
    latitude: { type: DataTypes.DECIMAL(9, 6) },
    longitude: { type: DataTypes.DECIMAL(9, 6) },
  },
  {
    tableName: "marker",
    timestamps: true,
  }
);

module.exports = Marker;
