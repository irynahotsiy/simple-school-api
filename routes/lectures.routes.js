const lectures = require("../controllers/lecture.controller.js");

const router = require("express").Router();

router.get("/lectures", lectures.findAll);

router.get("/lectures/:id", lectures.findOne);

router.put("/lectures/:id", lectures.update);

router.post("/lectures", lectures.create);

router.delete("/lectures/:id", lectures.delete);

router.get("/lectures/:id/teacher", lectures.findLectureTeacher);

router.get("/lectures/:id/group", lectures.findLectureGroup);

module.exports = router;
