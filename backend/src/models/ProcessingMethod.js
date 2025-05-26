const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProcessingMethod = sequelize.define(
  "ProcessingMethod",
  {
    methodID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  {
    tableName: "processing_method",
    timestamps: true,
  }
);

module.exports = ProcessingMethod;
