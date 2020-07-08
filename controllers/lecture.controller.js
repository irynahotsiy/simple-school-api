const asyncHandler = require("express-async-handler");
const db = require("../models");
const Lectures = db.lectures;
const Teachers = db.teachers;
const Groups = db.groups;
const Op = db.Sequelize.Op;

// find all lectures
exports.findAll = asyncHandler(async (req, res, next) => {
  const lectures = await Lectures.findAll();
  res.status(200).json(lectures);
});

// find lecture by id
exports.findOne = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.id;
  const currentLecture = await Lectures.findByPk(lectureId);
  if (!currentLecture) {
    res.status(400).send(`Bad request: "No such lecture"`);
  } else {
    res.status(200).json(currentLecture);
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
    const newLecture = await Lectures.create({
      teacher_id,
      group_id,
      audience,
      title,
      number,
    });
    res.status(201).json(newLecture);
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
    const updatedLectureDetails = await Lectures.findByPk(lectureId);
    res.status(201).json(updatedLectureDetails);
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

// find teacher the lecture belongs to
exports.findLectureTeacher = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.id;
  const lecture = await Lectures.findAll({ where: { id: lectureId } });
  const teacherId = lecture[0].teacher_id;
  const teacher = await Teachers.findAll({ where: { id: teacherId } });
  res.status(200).json(teacher);
});

// find the group which listen this lecture
exports.findLectureGroup = asyncHandler(async (req, res, next) => {
  const lectureId = req.params.id;
  const lecture = await Lectures.findAll({ where: { id: lectureId } });
  const groupId = lecture[0].group_id;
  const group = await Groups.findAll({ where: { id: groupId } });
  res.status(200).json(group);
});
