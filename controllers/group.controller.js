const asyncHandler = require("express-async-handler");
const db = require("../models");
const Groups = db.groups;
const Lectures = db.lectures;
const Students = db.students;

const Op = db.Sequelize.Op;

// Retrieve all groups from the database
exports.findAll = asyncHandler(async (req, res, next) => {
  const groups = await Groups.findAll();
  res.status(200).json(groups);
});

// get group by id
exports.findOne = asyncHandler(async (req, res, next) => {
  const groupId = req.params.id;
  const currentGroup = await Groups.findByPk(groupId);
  if (!currentGroup) {
    res.status(400).send(`Bad request: "No such group"`);
  } else {
    res.status(200).json(currentGroup);
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
    const newGroup = await Groups.create({
      name: name,
    });
    res.status(201).json(newGroup);
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
  if (allGroups.length > 1) {
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
    const updatedGroup = await Groups.findByPk(groupId);
    res.status(201).json(updatedGroup);
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
  const groupId = req.params.id;
  const group = await Groups.findAll({ where: { id: groupId } });
  if (group.length < 1) {
    res.status(400).send(`Bad request: "No such group"`);
  } else {
    const students = await Students.findAll({ where: { group_id: groupId } });
    res.status(200).json(students);
  }
});

// find all lectures the group contains
exports.findGroupLectures = asyncHandler(async (req, res, next) => {
  const groupId = req.params.id;
  const group = await Groups.findAll({ where: { id: groupId } });
  if (group.length < 1) {
    res.status(400).send(`Bad request: "No such group"`);
  } else {
    const lectures = await Lectures.findAll({ where: { group_id: groupId } });
    res.status(200).json(lectures);
  }
});
