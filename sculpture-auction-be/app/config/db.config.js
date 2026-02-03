const Sequelize = require('sequelize');
const sequelize = new Sequelize('sculpture_auction', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false, // tắt log
});

module.exports = sequelize;