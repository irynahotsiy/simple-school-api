const express = require("express");

const { promisify } = require("util");
const connection = require("../config/dbconnection");

const query = promisify(connection.query).bind(connection);
const router = express.Router();

async function getAllLectures() {
  const lectures = await query(`SELECT * from chatbottask.lectures`);
  return lectures;
}

async function getSelectedById(lectureId) {
  const currentLecture = await query(
    `SELECT * FROM chatbottask.lectures where lecture_id = ?`,
    [lectureId]
  );
  return currentLecture;
}

router.get("/lectures", async (req, res) => {
  try {
    const lectures = await getAllLectures();
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/lectures/:lecture_id", async (req, res) => {
  const letureId = req.params.lecture_id;
  try {
    const currentLecture = await getSelectedById(letureId);
    res.status(200).json(currentLecture);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.put("/lectures/:lecture_id", async (req, res) => {
  const lectureId = req.params.lecture_id;
  const { title, teacherId, groupId, audience, number } = req.body;
  try {
    const getAllLectures = await query(
      "SELECT * from chatbottask.lectures where lecture_id != ?",
      [lectureId]
    );
    if (getAllLectures.some((lecture) => lecture.number === number)) {
      res.status(400).send("Bad request: the same number");
    } else {
      const updetedParams = await query(
        `UPDATE chatbottask.lectures SET teacher_id = ?, group_id = ?, audience = ?, title = ?, number = ? where lecture_id = ?`,
        [teacherId, groupId, audience, title, number, lectureId]
      );
      const updatedLectureDetails = await getSelectedById(lectureId);
      res.status(200).json(updatedLectureDetails);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.post("/lectures", async (req, res) => {
  const { title, teacherId, groupId, audience, number } = req.body;
  try {
    const getAllLectures = await getAllLectures();
    if (getAllLectures.some((lecture) => lecture.number === number)) {
      res.status(400).send("Bad request: the same number");
    } else {
      const insertDetails = await query(
        `INSERT into chatbottask.lectures (teacher_id, group_id, audience, title, number) values (?, ?, ?, ?, ?)`,
        [teacherId, groupId, audience, title, number]
      );
      const insertId = insertDetails.insertId;
      const insertedLecture = await getSelectedById(insertId);
      res.status(200).json(insertedLecture);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.delete("/lectures/:lecture_id", async (req, res) => {
  const lectureId = req.params.lecture_id;
  try {
    const lectureToDelete = await query(
      `DELETE from chatbottask.lectures WHERE lecture_id = ?`,
      [lectureId]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/lectures/:lecture_id/teacher", async (req, res) => {
  const lectureId = req.params.lecture_id;
  try {
    const lecture = await query(
      "SELECT * from chatbottask.lectures where lecture_id = ?",
      [lectureId]
    );
    const teacherId = lecture[0].teacher_id;
    const teacher = await query(
      "SELECT * from chatbottask.teachers where teacher_id = ?",
      [teacherId]
    );
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/lectures/:lecture_id/group", async (req, res) => {
  const lectureId = req.params.lecture_id;
  try {
    const lecture = await query(
      "SELECT * from chatbottask.lectures where lecture_id = ?",
      [lectureId]
    );
    const groupId = lecture[0].group_id;
    console.log(groupId);
    const group = await query(
      "SELECT * from chatbottask.groups where group_id = ?",
      [groupId]
    );
    res.status(200).json(group);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});
module.exports = router;
