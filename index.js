const express = require("express");
//express dependencies
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./config/dbconnection");
const groupsRoutes = require("./routes/groups");
const lecturesPoutes = require("./routes/lectures");
const studentsRoutes = require("./routes/students");
const teachersRoutes = require("./routes/teachers");

// db connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// make server object that contain port property and the value for our server.
var server = {
  port: 4040,
};

// use the modules
app.use(cors());
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(groupsRoutes);
app.use(teachersRoutes);
app.use(studentsRoutes);
app.use(lecturesPoutes);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// simple route
app.get("/", (req, res) => {
  res.send("It works");
});

// starting the server
app.listen(server.port, () =>
  console.log(`Server started, listening port: ${server.port}`)
);
