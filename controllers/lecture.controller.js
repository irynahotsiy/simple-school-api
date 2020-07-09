const asyncHandler = require("express-async-handler");
const { getPagination, getPagingData } = require("../pagination/pagination");
const db = require("../models");
const Lectures = db.lectures;
const Teachers = db.teachers;
const Groups = db.groups;
const Op = db.Sequelize.Op;

// find all lectures
exports.findAll = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Lectures.findAndCountAll({ limit, offset });
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find lecture by id
exports.findOne = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.id;
  const response = await Lectures.findByPk(lectureId);
  if (!response) {
    res.status(400).send(`Bad request: "No such lecture"`);
  } else {
    res.status(200).json(response);
  }
});

exports.create = asyncHandler(async (req, res, next) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const { teacher_id, group_id, audience, title, number } = req.body;
  //Save lecture in the database
  const dublicatedNumber = await Lectures.findAll({
    where: { number },
  });
  if (dublicatedNumber.length > 0) {
    res
      .status(400)
      .send(`Bad Request: Can't create lecture with dublicated number`);
  } else {
    const response = await Lectures.create({
      teacher_id,
      group_id,
      audience,
      title,
      number,
    });
    res.status(201).json(response);
  }
});

// update the current lecture details
exports.update = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const lectureId = req.params.id;
  const lectureNumber = req.body.number;
  const body = req.body;
  const allLectures = await Lectures.findAll({
    where: { id: { [Op.not]: lectureId }, number: lectureNumber },
  });

  if (allLectures.length > 0) {
    res
      .status(400)
      .send(`Bad Request: "Can't update lecture details. Dublicated number"`);
  } else {
    const updatedDetails = await Lectures.update(body, {
      where: {
        id: lectureId,
      },
    });
    const response = await Lectures.findByPk(lectureId);
    res.status(201).json(response);
  }
});

// delete lecture from database
exports.delete = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.id;
  const lectureToDelete = await Lectures.destroy({
    where: {
      id: lectureId,
    },
  });
  res.status(204).send();
});

exports.findLectureTeacher = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.id;
  const lecture = await Lectures.findByPk(lectureId);
  if (lecture === null) {
    res.status(400).send(`Bad request: "Lecture not found"`);
  } else {
    const teacherId = lecture.teacher_id;
    const response = await Teachers.findByPk(teacherId);
    res.status(200).json(response);
  }
});

// find the group which listen this lecture
exports.findLectureGroup = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.id;
  const lecture = await Lectures.findByPk(lectureId);
  if (lecture === null) {
    res.status(400).send(`Bad request: "Lecture not found"`);
  } else {
    const groupId = lecture.group_id;
    const response = await Groups.findByPk(groupId);
    res.status(200).json(response);
  }
});
