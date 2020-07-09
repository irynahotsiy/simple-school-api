const asyncHandler = require("express-async-handler");
const { getPagination, getPagingData } = require("../pagination/pagination");
const db = require("../models");
const Students = db.students;
const Lectures = db.lectures;
const Op = db.Sequelize.Op;

// find all students
exports.findAll = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Students.findAndCountAll({ limit, offset });
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find student by id
exports.findOne = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const response = await Students.findByPk(studentId);
  if (!response) {
    res.status(400).send(`Bad request: "No such student"`);
  } else {
    res.status(200).json(response);
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
    const response = await Students.create({ name, email, group_id });
    res.status(201).json(response);
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
    const response = await Students.findByPk(studentId);
    res.status(201).json(response);
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
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const studentId = req.params.id;
  const currentStudent = await Students.findByPk(studentId);
  if (currentStudent === null) {
    res.status(400).send(`Bad request: "Student not found"`);
  } else {
    const data = await Students.findAndCountAll({
      limit,
      offset,
      where: { group_id: currentStudent.group_id },
    });
    const response = getPagingData(data, page, limit);
    res.status(200).json(response);
  }
});

// find all lectures belong to the student
exports.findAllStudentLectures = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const currentStudent = await Students.findByPk(studentId);
  if (currentStudent === null) {
    res.status(400).send(`Bad request: "Student not found"`);
  } else {
    const data = await Lectures.findAndCountAll({
      limit,
      offset,
      where: { group_id: currentStudent.group_id },
    });
    const response = getPagingData(data, page, limit);
    res.status(200).json(response);
  }
});
