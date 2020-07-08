const db = require("../models");
const Teachers = db.teachers;
const Lectures = db.lectures;
const Op = db.Sequelize.Op;

// Retrieve all teachers from the database.
exports.findAll = async (req, res) => {
  try {
    const teachers = await Teachers.findAll();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// find teacher by id
exports.findOne = async (req, res) => {
  const teacherId = req.params.id;
  try {
    const currentTeacher = await Teachers.findByPk(teacherId);
    if (!currentTeacher) {
      res.status(400).send(`Bad request: "No such teacher"`);
    } else {
      res.status(200).json(currentTeacher);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

//Create and Save a new teacher
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }

  const { name, email } = req.body;

  //Save teacher in the database
  try {
    const teachersWithDublEmail = await Teachers.findAll({
      where: { email },
    });
    console.log(teachersWithDublEmail);
    if (teachersWithDublEmail.length > 0) {
      res
        .status(400)
        .send(`Bad Request: Can't create teacher with dublicated email`);
      return;
    } else {
      const newTeacher = await Teachers.create({
        name: name,
        email: email,
      });
      res.status(201).json(newTeacher);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// Update teacher details by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const teacherId = req.params.id;

  const teacherEmail = req.body.email;
  const body = req.body;
  try {
    const allTeachers = await Teachers.findAll({
      where: { id: { [Op.not]: teacherId }, email: teacherEmail },
    });
    if (allTeachers.length > 1) {
      res
        .status(400)
        .send(`Bad Request: Can't create teacher with dublicated email`);
    } else {
      const updatedDetails = await Teachers.update(body, {
        where: {
          id: teacherId,
        },
      });
      const updatedTeacher = await Teachers.findByPk(teacherId);
      res.status(201).json(updatedTeacher);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// Delete a teacher with the specified id in the request
exports.delete = async (req, res) => {
  const teacherId = req.params.id;
  try {
    const teacherToDelete = await Teachers.destroy({
      where: {
        id: teacherId,
      },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// Find all lectures of teacher
exports.findAllLecturesOfTeacher = async (req, res) => {
  const teacherId = req.params.id;
  try {
    const lectures = await Lectures.findAll({
      where: { teacher_id: teacherId },
    });
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};
