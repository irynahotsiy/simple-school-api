const Sequelize = require('sequelize');
const dbConfig = require('../config/dbconnection');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql',
  },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.teachers = require('./teachers.js')(sequelize, Sequelize);
db.lectures = require('./lectures.js')(sequelize, Sequelize);
db.groups = require('./groups.js')(sequelize, Sequelize);
db.students = require('./students.js')(sequelize, Sequelize);

module.exports = db;
