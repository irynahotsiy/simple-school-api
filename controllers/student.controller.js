const asyncHandler = require("express-async-handler");
const db = require("../models");
const Students = db.students;
const Lectures = db.lectures;
const Op = db.Sequelize.Op;

// find all students
exports.findAll = asyncHandler(async (req, res, next) => {
  const students = await Students.findAll();
  res.status(200).json(students);
});

// find student by id
exports.findOne = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const currentStudent = await Students.findByPk(studentId);
  if (!currentStudent) {
    res.status(400).send(`Bad request: "No such student"`);
  } else {
    res.status(200).json(currentStudent);
  }
});

// create a new student
exports.create = asyncHandler(async (req, res, next) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const { name, email, group_id } = req.body;
  //Save student in the database
  const dublicatedEmail = await Students.findAll({
    where: { email },
  });
  if (dublicatedEmail.length > 0) {
    res
      .status(400)
      .send(`Bad Request: "Can't create student with dublicated email"`);
  } else {
    const newStudent = await Students.create({ name, email, group_id });
    res.status(201).json(newStudent);
  }
});

// update student details
exports.update = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const studentId = req.params.id;
  const studentEmail = req.body.email;
  const body = req.body;
  const allStudents = await Students.findAll({
    where: { id: { [Op.not]: studentId }, email: studentEmail },
  });
  console.log("allStudents", allStudents);
  if (allStudents.length > 0) {
    res
      .status(400)
      .send(`Bad Request: "Can't update student details. Dublicated email."`);
  } else {
    const updatedDetails = await Students.update(body, {
      where: {
        id: studentId,
      },
    });
    const updatedStudentDetails = await Students.findByPk(studentId);
    res.status(201).json(updatedStudentDetails);
  }
});

// delete student from database
exports.delete = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const studentToDelete = await Students.destroy({
    where: {
      id: studentId,
    },
  });
  res.status(204).send();
});

// find all groupmates by id
exports.findAllGroupMates = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const currentStudent = await Students.findAll({ where: { id: studentId } });
  const groupMates = await Students.findAll({
    where: { group_id: currentStudent[0].group_id },
  });
  res.status(200).json(groupMates);
});

// find all lectures belong to the student
exports.findAllStudentLectures = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const currentStudent = await Students.findAll({ where: { id: studentId } });
  const lectures = await Lectures.findAll({
    where: { group_id: currentStudent[0].group_id },
  });
  res.status(200).json(lectures);
});
