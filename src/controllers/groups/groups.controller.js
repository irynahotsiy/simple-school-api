const asyncHandler = require('express-async-handler');

const db = require('../../models');

const Groups = db.groups;
const Lectures = db.lectures;
const Students = db.students;
const { Op } = db.Sequelize;

const { getPagination, getPagingData } = require('../../pagination/pagination');

const { sendError } = require('../../helpers/helpers');

// Retrieve all groups from the database
exports.findAll = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Groups.findAndCountAll({ limit, offset });
  if (data == null) {
    sendError(res, 400, 'Bad Request: Data not found');
    return;
  }
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// get group by id
exports.findOne = asyncHandler(async (req, res) => {
  const groupId = req.params.id;
  const response = await Groups.findByPk(groupId);
  if (response == null) {
    sendError(res, 400, 'Bad request: Group not found');
    return;
  }
  res.status(200).json(response);
});

exports.create = asyncHandler(async (req, res) => {
  // Validate request
  if (!req.body) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  const { name } = req.body;
  if (name == null) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  // Save group in the database
  const dublicatedName = await Groups.findAll({
    where: { name },
  });
  if (dublicatedName.length > 0) {
    sendError(res, 400, 'Bad Request: Such name already exist in the database');
    return;
  }
  const response = await Groups.create(req.body);
  res.status(201).json(response);
});

// update group details
exports.update = asyncHandler(async (req, res) => {
  if (!req.body) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  const groupId = req.params.id;
  const { name } = req.body;
  if (name == null) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  const allGroups = await Groups.findAll({
    where: { id: { [Op.not]: groupId }, name },
  });
  if (allGroups.length > 0) {
    sendError(res, 400, 'Bad Request: Can\'t update group. Such name already exist in the database.');
    return;
  }
  await Groups.update(req.body, {
    where: {
      id: groupId,
    },
  });
  const response = await Groups.findByPk(groupId);
  res.status(201).json(response);
});

// delete group from database
exports.delete = asyncHandler(async (req, res) => {
  const groupId = req.params.id;
  await Groups.destroy({
    where: {
      id: groupId,
    },
  });
  res.status(204).send();
});

// find all students belong to the current group
exports.findGroupStudents = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const groupId = req.params.id;
  const data = await Students.findAndCountAll({
    limit,
    offset,
    where: { group_id: groupId },
  });
  if (data == null) {
    sendError(res, 400, 'Bad Request: Data not found');
    return;
  }
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find all lectures the group contains
exports.findGroupLectures = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const groupId = req.params.id;
  const data = await Lectures.findAndCountAll({
    limit,
    offset,
    where: { group_id: groupId },
  });
  if (data == null) {
    sendError(res, 400, 'Bad Request: Data not found');
    return;
  }
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});
