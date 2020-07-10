const asyncHandler = require('express-async-handler');

const db = require('../../models');

const Lectures = db.lectures;
const Teachers = db.teachers;
const Groups = db.groups;
const { Op } = db.Sequelize;

const { getPagination, getPagingData } = require('../../pagination/pagination');

const { sendError } = require('../../helpers/helpers');

// find all lectures
exports.findAll = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Lectures.findAndCountAll({ limit, offset });
  if (data == null) {
    sendError(res, 400, 'Bad Request: Data not found');
    return;
  }
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find lecture by id
exports.findOne = asyncHandler(async (req, res) => {
  const lectureId = req.params.id;
  const response = await Lectures.findByPk(lectureId);
  if (response == null) {
    sendError(res, 400, 'Bad request: No such lecture');
    return;
  }
  res.status(200).json(response);
});

exports.create = asyncHandler(async (req, res) => {
  if (!req.body) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  const { number, audience, title } = req.body;
  // Validate request
  if (number == null || audience == null || title == null) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  // Save lecture in the database
  const dublicatedNumber = await Lectures.findAll({
    where: { number },
  });
  if (dublicatedNumber.length > 0) {
    sendError(res, 400, 'Bad Request: Can\'t create lecture with dublicated number');
    return;
  }
  const response = await Lectures.create(req.body);
  res.status(201).json(response);
});

// update the current lecture details
exports.update = asyncHandler(async (req, res) => {
  if (!req.body) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  const { number, audience, title } = req.body;
  // Validate request
  if (number == null || audience == null || title == null) {
    sendError(res, 400, 'Bad Request: Content can not be empty!');
    return;
  }
  const lectureId = req.params.id;
  const allLectures = await Lectures.findAll({
    where: { id: { [Op.not]: lectureId }, number },
  });

  if (allLectures.length > 0) {
    sendError(res, 400, 'Bad Request: Can\'t update lecture details. Dublicated number');
    return;
  }
  await Lectures.update(req.body, {
    where: {
      id: lectureId,
    },
  });
  const response = await Lectures.findByPk(lectureId);
  res.status(201).json(response);
});

// delete lecture from database
exports.delete = asyncHandler(async (req, res) => {
  const lectureId = req.params.id;
  await Lectures.destroy({
    where: {
      id: lectureId,
    },
  });
  res.status(204).send();
});

exports.findLectureTeacher = asyncHandler(async (req, res) => {
  const lectureId = req.params.id;
  const lecture = await Lectures.findByPk(lectureId);
  if (lecture == null) {
    sendError(res, 400, 'Bad request: Lecture not found');
    return;
  }
  const teacherId = lecture.teacher_id;
  const response = await Teachers.findByPk(teacherId);
  res.status(200).json(response);
});

// find the group which listen this lecture
exports.findLectureGroup = asyncHandler(async (req, res) => {
  const lectureId = req.params.id;
  const lecture = await Lectures.findByPk(lectureId);
  if (lecture == null) {
    sendError(res, 400, 'Bad request: Lecture not found');
    return;
  }
  const groupId = lecture.group_id;
  const response = await Groups.findByPk(groupId);
  res.status(200).json(response);
});
