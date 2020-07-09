const asyncHandler = require("express-async-handler");
const { getPagination, getPagingData } = require("../pagination/pagination");
const db = require("../models");
const Teachers = db.teachers;
const Lectures = db.lectures;
const Op = db.Sequelize.Op;

// Retrieve all teachers from the database.
exports.findAll = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Teachers.findAndCountAll({
    limit,
    offset,
  });
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find teacher by id
exports.findOne = asyncHandler(async (req, res, next) => {
  const teacherId = req.params.id;
  const response = await Teachers.findByPk(teacherId);
  if (!response) {
    res.status(400).send(`Bad request: "No such teacher"`);
  } else {
    res.status(200).json(response);
  }
});

//Create and Save a new teacher
exports.create = asyncHandler(async (req, res, next) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const { name, email } = req.body;
  //Save teacher in the database
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
    const response = await Teachers.create({
      name: name,
      email: email,
    });
    res.status(201).json(response);
  }
});

// Update teacher details by the id in the request
exports.update = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const teacherId = req.params.id;
  const teacherEmail = req.body.email;
  const body = req.body;
  const allTeachers = await Teachers.findAll({
    where: { id: { [Op.not]: teacherId }, email: teacherEmail },
  });
  if (allTeachers.length > 0) {
    res
      .status(400)
      .send(`Bad Request: Can't create teacher with dublicated email`);
  } else {
    const updatedDetails = await Teachers.update(body, {
      where: {
        id: teacherId,
      },
    });
    const response = await Teachers.findByPk(teacherId);
    res.status(201).json(response);
  }
});

// Delete a teacher with the specified id in the request
exports.delete = asyncHandler(async (req, res, next) => {
  const teacherId = req.params.id;
  const teacherToDelete = await Teachers.destroy({
    where: {
      id: teacherId,
    },
  });
  res.status(204).send();
});

// Find all lectures of teacher
exports.findAllLecturesOfTeacher = asyncHandler(async (req, res, next) => {
  const teacherId = req.params.id;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Lectures.findAndCountAll({
    limit,
    offset,
    where: { teacher_id: teacherId },
  });
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});
