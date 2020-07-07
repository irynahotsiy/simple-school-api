const express = require("express");

const { promisify } = require("util");
const connection = require("../config/dbconnection");

const query = promisify(connection.query).bind(connection);
const router = express.Router();

// general function for selected by id
async function getAllGroups() {
  const groups = await query(`SELECT * FROM chatbottask.groups`);
  return groups;
}

async function getSelectedById(groupId) {
  const currentGroup = await query(
    `SELECT * FROM chatbottask.groups where group_id = ?`,
    [groupId]
  );
  return currentGroup;
}

router.get("/groups", async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/groups/:group_id", async (req, res) => {
  const groupId = req.params.group_id;
  try {
    const currentGroup = await getSelectedById(groupId);
    if (currentGroup.length < 1) {
      res.status(404).send("Not found");
    }
    res.status(200).json(currentGroup);
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.put("/groups/:group_id", async (req, res) => {
  const groupId = req.params.group_id;
  const groupName = req.body.name;
  try {
    const groups = await query(
      "SELECT * FROM chatbottask.groups where group_id != ?",
      [groupId]
    );
    if (groups.some((group) => group.name === groupName)) {
      res
        .status(400)
        .send(`Bad request: "Can't create group with dublicated name"`);
    } else {
      const updetedParams = await query(
        `UPDATE chatbottask.groups SET group_name = ? where group_id = ?`,
        [groupName, groupId]
      );
      const updatedGroupDetails = await getSelectedById(groupId);
      res.status(201).json(updatedGroupDetails);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.post("/groups", async (req, res) => {
  const groupName = req.body.name;
  try {
    const groups = await getAllGroups();
    if (groups.some((group) => group.name === groupName)) {
      res
        .status(400)
        .send(`Bad request: "Can't create group with dublicated name"`);
    } else {
      const insertDetails = await query(
        `INSERT into chatbottask.groups (group_name) values (?)`,
        [groupName]
      );
      const insertId = insertDetails.insertId;
      const insertedGroup = await getSelectedById(insertId);
      res.status(201).json(insertedGroup);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.delete("/groups/:group_id", async (req, res) => {
  const groupId = req.params.group_id;
  try {
    const groupToDelete = await query(
      `DELETE from chatbottask.groups WHERE group_id = ?`,
      [groupId]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/groups/:group_id/students", async (req, res) => {
  const groupId = req.params.group_id;
  try {
    const group = await getSelectedById(groupId);
    if (group.length < 1) {
      res.status(400).send(`Bad request: "No such group"`);
    } else {
      const students = await query(
        "SELECT * from chatbottask.students where group_id = ?",
        [groupId]
      );

      res.status(200).json(students);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

router.get("/groups/:group_id/lectures", async (req, res) => {
  const groupId = req.params.group_id;
  try {
    const group = await getSelectedById(groupId);
    if (group.length < 1) {
      res.status(400).send(`Bad request: "No such group"`);
    } else {
      const lectures = await query(
        "SELECT * from chatbottask.lectures where group_id = ?",
        [groupId]
      );
      res.status(200).json(lectures);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error + "${err.message}"`);
  }
});

module.exports = router;
