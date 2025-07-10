const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BaseIP = sequelize.define('BaseIP', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1,
  },
  URL_IP: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  timestamps: true,
  tableName: 'BaseIP_URL',
});

module.exports = BaseIP;