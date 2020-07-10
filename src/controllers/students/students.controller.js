const asyncHandler = require('express-async-handler');

const db = require('../../models');

const Students = db.students;
const Lectures = db.lectures;
const { Op } = db.Sequelize;

const { getPagination, getPagingData } = require('../../pagination/pagination');

const { sendError } = require('../../helpers/helpers');

// find all students
exports.findAll = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Students.findAndCountAll({ limit, offset });
  if (data == null) {
    sendError(res, 400, 'Bad Request: Data not found');
    return;
  }
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find student by id
exports.findOne = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  const response = await Students.findByPk(studentId);
  if (response == null) {
    sendError(res, 400, 'Bad request: No such student');
    return;
  }
  res.status(200).json(response);
});

// create a new student
exports.create = asyncHandler(async (req, res) => {
  // Validate request
  if (!req.body) {
    sendError(res, 400, 'Bad Request: Invalid payload!');
    return;
  }
  const { email, name } = req.body;
  if (email == null || name == null) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  // Save student in the database
  const dublicatedEmail = await Students.findAll({
    where: { email },
  });
  if (dublicatedEmail.length > 0) {
    sendError(res, 400, 'Bad Request: Can\'t create student with dublicated email');
    return;
  }
  const response = await Students.create(req.body);
  res.status(201).json(response);
});

// update student details
exports.update = asyncHandler(async (req, res) => {
  if (!req.body) {
    sendError(res, 400, 'Bad Request: Invalid payload!');
    return;
  }
  const { email, name } = req.body;
  if (email == null || name == null) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  const studentId = req.params.id;
  const allStudents = await Students.findAll({
    where: { id: { [Op.not]: studentId }, email },
  });
  if (allStudents.length > 0) {
    sendError(res, 400, 'Bad Request: Can\'t update student details. Dublicated email.');
    return;
  }
  await Students.update(req.body, {
    where: {
      id: studentId,
    },
  });
  const response = await Students.findByPk(studentId);
  res.status(201).json(response);
});

// delete student from database
exports.delete = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  await Students.destroy({
    where: {
      id: studentId,
    },
  });
  res.status(204).send();
});

// find all groupmates by id
exports.findAllGroupMates = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const studentId = req.params.id;
  const currentStudent = await Students.findByPk(studentId);
  if (currentStudent === null) {
    res.status(400).send('Bad request: Student not found');
  } else {
    const data = await Students.findAndCountAll({
      limit,
      offset,
      where: { group_id: currentStudent.group_id },
    });
    if (data == null) {
      sendError(res, 400, 'Bad Request: Data not found');
      return;
    }
    const response = getPagingData(data, page, limit);
    res.status(200).json(response);
  }
});

// find all lectures belong to the student
exports.findAllStudentLectures = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const currentStudent = await Students.findByPk(studentId);
  if (currentStudent === null) {
    res.status(400).send('Bad request: Student not found');
  } else {
    const data = await Lectures.findAndCountAll({
      limit,
      offset,
      where: { group_id: currentStudent.group_id },
    });
    if (data == null) {
      sendError(res, 400, 'Bad Request: Data not found');
      return;
    }
    const response = getPagingData(data, page, limit);
    res.status(200).json(response);
  }
});
