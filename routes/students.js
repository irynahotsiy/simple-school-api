const express = require("express");

const { promisify } = require("util");
const connection = require("../config/dbconnection");

const query = promisify(connection.query).bind(connection);
const router = express.Router();

async function getAllStudents() {
  const students = await query(`SELECT * from chatbottask.students`);
  return students;
}

async function getSelectedById(studentId) {
  const currentStudent = await query(
    `SELECT * FROM chatbottask.students where student_id = ?`,
    [studentId]
  );
  return currentStudent;
}

router.get("/students", async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/students/:student_id", async (req, res) => {
  const studentId = req.params.student_id;
  try {
    const currentStudent = await getSelectedById(studentId);
    res.status(200).json(currentStudent);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.put("/students/:student_id", async (req, res) => {
  const studentId = req.params.student_id;
  const studentName = req.body.name;
  const studentEmail = req.body.email;
  const studentGroupId = req.body.groupId;
  try {
    const allStudents = await query(
      "SELECT * from chatbottask.students where student_id != ?",
      [studentId]
    );
    if (allStudents.some((student) => student.email === studentEmail)) {
      res.status(400).send("Bad request: email is dublicated");
    } else {
      const updetedParams = await query(
        `UPDATE chatbottask.students SET student_name = ?, email = ?, group_id = ? where student_id = ?`,
        [studentName, studentEmail, studentGroupId, studentId]
      );
    }
    const updatedStudentDetails = await getSelectedById(studentId);
    res.status(200).json(updatedStudentDetails);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.post("/students", async (req, res) => {
  const studentName = req.body.name;
  const studentEmail = req.body.email;
  const studentGroupId = req.body.groupId;
  try {
    const allStudents = await getAllStudents();
    if (allStudents.some((student) => student.email === studentEmail)) {
      res.status(400).send("Bad request: email is dublicated");
    } else {
      const insertDetails = await query(
        `INSERT into chatbottask.students (student_name, email, group_id) values (?, ?, ?)`,
        [studentName, studentEmail, studentGroupId]
      );
      const insertId = insertDetails.insertId;
      const insertedStudent = await getSelectedById(insertId);
      res.status(200).json(insertedStudent);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.delete("/students/:student_id", async (req, res) => {
  const studentId = req.params.student_id;
  try {
    const studentToDelete = await query(
      `DELETE from chatbottask.students WHERE student_id = ?`,
      [studentId]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/students/:student_id/groupmates", async (req, res) => {
  const studentId = req.params.student_id;
  try {
    const student = await query(
      "SELECT * from chatbottask.students where student_id = ?",
      [studentId]
    );
    const studentGroup = await query(
      "SELECT * from chatbottask.students where group_id = ?",
      [student[0].group_id]
    );
    res.status(200).json(studentGroup);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/students/:student_id/lectures", async (req, res) => {
  const studentId = req.params.student_id;
  try {
    const student = await query(
      "SELECT * from chatbottask.students where student_id = ?",
      [studentId]
    );
    const lectures = await query(
      "SELECT * from chatbottask.lectures where group_id = ?",
      [student[0].group_id]
    );
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

module.exports = router;
