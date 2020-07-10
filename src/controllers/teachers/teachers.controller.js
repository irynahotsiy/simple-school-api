const asyncHandler = require('express-async-handler');

const db = require('../../models');

const Teachers = db.teachers;
const Lectures = db.lectures;
const { Op } = db.Sequelize;

const { getPagination, getPagingData } = require('../../pagination/pagination');

const { sendError } = require('../../helpers/helpers');

// Retrieve all teachers from the database.
exports.findAll = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Teachers.findAndCountAll({
    limit,
    offset,
  });
  if (data == null) {
    sendError(res, 400, 'Bad Request: Data not found');
    return;
  }
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find teacher by id
exports.findOne = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  const response = await Teachers.findByPk(teacherId);
  if (response == null) {
    sendError(res, 400, 'Bad request: No such teacher');
    return;
  }
  res.status(200).json(response);
});

// Create and Save a new teacher
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
  // Save teacher in the database
  const teachersWithDublEmail = await Teachers.findAll({
    where: { email },
  });
  if (teachersWithDublEmail.length > 0) {
    sendError(res, 400, 'Bad Request: Can\'t create teacher with dublicated email');
    return;
  }
  const response = await Teachers.create(req.body);
  res.status(201).json(response);
});

// Update teacher details by the id in the request
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
  const teacherId = req.params.id;
  const allTeachers = await Teachers.findAll({
    where: { id: { [Op.not]: teacherId }, email },
  });
  if (allTeachers.length > 0) {
    sendError(res, 400, 'Bad Request: Can\'t create teacher with dublicated email');
    return;
  }
  await Teachers.update(req.body, {
    where: {
      id: teacherId,
    },
  });
  const response = await Teachers.findByPk(teacherId);
  res.status(201).json(response);
});

// Delete a teacher with the specified id in the request
exports.delete = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  await Teachers.destroy({
    where: {
      id: teacherId,
    },
  });
  res.status(204).send();
});

// Find all lectures of teacher
exports.findAllLecturesOfTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Lectures.findAndCountAll({
    limit,
    offset,
    where: { teacher_id: teacherId },
  });
  if (data == null) {
    sendError(res, 400, 'Bad Request: Data not found');
    return;
  }
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});
