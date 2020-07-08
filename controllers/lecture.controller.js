const db = require("../models");
const Lectures = db.lectures;
const Teachers = db.teachers;
const Groups = db.groups;
const Op = db.Sequelize.Op;

// find all lectures
exports.findAll = async (req, res) => {
  try {
    const lectures = await Lectures.findAll();
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// find lecture by id
exports.findOne = async (req, res) => {
  const lectureId = req.params.id;
  try {
    const currentLecture = await Lectures.findByPk(lectureId);
    if (!currentLecture) {
      res.status(400).send(`Bad request: "No such lecture"`);
    } else {
      res.status(200).json(currentLecture);
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

  const { teacher_id, group_id, audience, title, number } = req.body;

  //Save lecture in the database
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// update the current lecture details
exports.update = async (req, res) => {
  if (!req.body) {
    res.status(400).send(`Bad Request: "Content can not be empty!"`);
    return;
  }

  const lectureId = req.params.id;

  const lectureNumber = req.body.number;
  const body = req.body;
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// delete lecture from database
exports.delete = async (req, res) => {
  const lectureId = req.params.id;
  try {
    const lectureToDelete = await Lectures.destroy({
      where: {
        id: lectureId,
      },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// find teacher the lecture belongs to
exports.findLectureTeacher = async (req, res) => {
  const lectureId = req.params.id;
  try {
    const lecture = await Lectures.findAll({ where: { id: lectureId } });
    const teacherId = lecture[0].teacher_id;
    const teacher = await Teachers.findAll({ where: { id: teacherId } });
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};

// find the group which listen this lecture
exports.findLectureGroup = async (req, res) => {
  const lectureId = req.params.id;
  try {
    const lecture = await Lectures.findAll({ where: { id: lectureId } });
    const groupId = lecture[0].group_id;
    const group = await Groups.findAll({ where: { id: groupId } });
    res.status(200).json(group);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
};
