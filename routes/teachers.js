const express = require("express");

const { promisify } = require("util");
const connection = require("../config/dbconnection");

const query = promisify(connection.query).bind(connection);
const router = express.Router();

async function getAllTeachers() {
  const teachers = await query(`SELECT * FROM chatbottask.teachers`);
  return teachers;
}

async function getSelectedById(teacherId) {
  const currentTeacher = await query(
    `SELECT * FROM chatbottask.teachers where teacher_id = ?`,
    [teacherId]
  );
  return currentTeacher;
}

router.get("/teachers", async (req, res) => {
  try {
    const teachers = await getAllTeachers();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/teachers/:teacher_id", async (req, res) => {
  const teacherId = req.params.teacher_id;
  try {
    const currentTeacher = await getSelectedById(teacherId);
    if (currentTeacher.length < 1) {
      res.status(400).send(`Bad request: "No such teacher"`);
    } else {
      res.status(200).json(currentTeacher);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.put("/teachers/:teacher_id", async (req, res) => {
  const teacherId = req.params.teacher_id;
  const teacherName = req.body.name;
  const teacherEmail = req.body.email;
  try {
    const allTeachers = await query(
      `SELECT * FROM chatbottask.teachers where teacher_id != ?`,
      [teacherId]
    );
    if (allTeachers.some((teacher) => teacher.email === teacherEmail)) {
      res.status(400).send("Bad Request");
    } else {
      const updetedParams = await query(
        `UPDATE chatbottask.teachers SET teacher_name = ?, email = ? where teacher_id = ?`,
        [teacherName, teacherEmail, teacherId]
      );
      const updatedTeacherDetails = await getSelectedById(teacherId);
      res.status(201).json(updatedTeacherDetails);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.post("/teachers", async (req, res) => {
  const teacherName = req.body.name;
  const teacherEmail = req.body.email;
  try {
    const allTeachers = await getAllTeachers();
    if (allTeachers.some((teacher) => teacher.email === teacherEmail)) {
      res.status(400).send("Bad Request");
    } else {
      const insertDetails = await query(
        `INSERT into chatbottask.teachers (teacher_name, email) values (?, ?)`,
        [teacherName, teacherEmail]
      );
      const insertId = insertDetails.insertId;
      const insertedTeather = await getSelectedById(insertId);
      res.status(201).json(insertedTeather);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.delete("/teachers/:teacher_id", async (req, res) => {
  const teacherId = req.params.teacher_id;
  try {
    const teacherToDelete = await query(
      `DELETE from chatbottask.teachers WHERE teacher_id = ?`,
      [teacherId]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/teachers/:teacher_id/lectures", async (req, res) => {
  const teacherId = req.params.teacher_id;
  try {
    const lections = await query(
      "SELECT * from chatbottask.lectures where teacher_id = ?",
      [teacherId]
    );
    res.status(200).json(lections);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});
module.exports = router;
