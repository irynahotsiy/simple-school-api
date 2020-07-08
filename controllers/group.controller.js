const db = require("../models");
const Groups = db.groups;
const Lectures = db.lectures;
const Students = db.students;

const Op = db.Sequelize.Op;

// Retrieve all groups from the database
exports.findAll = async (req, res) => {
  try {
    const groups = await Groups.findAll();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// get group by id
exports.findOne = async (req, res) => {
  const groupId = req.params.id;
  try {
    const currentGroup = await Groups.findByPk(groupId);
    if (!currentGroup) {
      res.status(400).send(`Bad request: "No such group"`);
    } else {
      res.status(200).json(currentGroup);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }

  const { name } = req.body;

  //Save group in the database
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// update group details
exports.update = async (req, res) => {
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }
  const groupId = req.params.id;

  const groupName = req.body.name;
  const body = req.body;
  try {
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
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// delete group from database
exports.delete = async (req, res) => {
  const groupId = req.params.id;
  try {
    const groupToDelete = await Groups.destroy({
      where: {
        id: groupId,
      },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// find all students belong to the current group
exports.findGroupStudents = async (req, res) => {
  const groupId = req.params.id;
  try {
    const group = await Groups.findAll({ where: { id: groupId } });
    if (group.length < 1) {
      res.status(400).send(`Bad request: "No such group"`);
    } else {
      const students = await Students.findAll({ where: { group_id: groupId } });
      res.status(200).json(students);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// find all lectures the group contains
exports.findGroupLectures = async (req, res) => {
  const groupId = req.params.id;
  try {
    const group = await Groups.findAll({ where: { id: groupId } });
    if (group.length < 1) {
      res.status(400).send(`Bad request: "No such group"`);
    } else {
      const lectures = await Lectures.findAll({ where: { group_id: groupId } });
      res.status(200).json(lectures);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};
