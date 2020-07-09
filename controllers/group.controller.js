const asyncHandler = require("express-async-handler");
const { getPagination, getPagingData } = require("../pagination/pagination");
const db = require("../models");
const Groups = db.groups;
const Lectures = db.lectures;
const Students = db.students;
const Op = db.Sequelize.Op;

// Retrieve all groups from the database
exports.findAll = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await Groups.findAndCountAll({ limit, offset });
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// get group by id
exports.findOne = asyncHandler(async (req, res, next) => {
  const groupId = req.params.id;
  const response = await Groups.findByPk(groupId);
  if (!response) {
    res.status(400).send(`Bad request: "No such group"`);
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
  const { name } = req.body;
  //Save group in the database
  const dublicatedName = await Groups.findAll({
    where: { name: name },
  });
  if (dublicatedName.length > 0) {
    res
      .status(400)
      .send(`Bad Request: Such name already exist in the database`);
  } else {
    const response = await Groups.create({
      name: name,
    });
    res.status(201).json(response);
  }
});

// update group details
exports.update = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const groupId = req.params.id;
  const groupName = req.body.name;
  const body = req.body;
  const allGroups = await Groups.findAll({
    where: { id: { [Op.not]: groupId }, name: groupName },
  });
  if (allGroups.length > 0) {
    res
      .status(400)
      .send(
        `Bad Request: Can't update group. Such name already exist in the database `
      );
  } else {
    const updatedDetails = await Groups.update(body, {
      where: {
        id: groupId,
      },
    });
    const response = await Groups.findByPk(groupId);
    res.status(201).json(response);
  }
});

// delete group from database
exports.delete = asyncHandler(async (req, res, next) => {
  const groupId = req.params.id;
  const groupToDelete = await Groups.destroy({
    where: {
      id: groupId,
    },
  });
  res.status(204).send();
});

// find all students belong to the current group
exports.findGroupStudents = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const groupId = req.params.id;
  const data = await Students.findAndCountAll({
    limit,
    offset,
    where: { group_id: groupId },
  });
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});

// find all lectures the group contains
exports.findGroupLectures = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const groupId = req.params.id;
  const data = await Lectures.findAndCountAll({
    limit,
    offset,
    where: { group_id: groupId },
  });
  const response = getPagingData(data, page, limit);
  res.status(200).json(response);
});
