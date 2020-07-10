const express = require('express');
// express dependencies
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const groupsRoutes = require('./routes/groups/groups.routes');
const lecturesPoutes = require('./routes/lectures/lectures.routes');
const studentsRoutes = require('./routes/students/students.routes');
const teachersRoutes = require('./routes/teachers/teachers.routes');
const db = require('./models');

db.sequelize.sync();

const server = {
  port: 4040,
};

// use the modules
app.use(cors());
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use the routes
app.use(groupsRoutes);
app.use(teachersRoutes);
app.use(studentsRoutes);
app.use(lecturesPoutes);

app.use('*', (req, res) => {
  res.status(404).send('Not found');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

// starting the server
app.listen(server.port);
