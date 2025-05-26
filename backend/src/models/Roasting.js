const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Roasting = sequelize.define(
  "Roasting",
  {
    roastingID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    tableName: "roasting",
    timestamps: true,
  }
);

module.exports = Roasting;
