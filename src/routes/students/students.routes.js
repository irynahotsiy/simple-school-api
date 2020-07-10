const router = require('express').Router();

const { students } = require('../../controllers');

router.get('/students', students.findAll);

router.get('/students/:id', students.findOne);

router.put('/students/:id', students.update);

router.post('/students', students.create);

router.delete('/students/:id', students.delete);

router.get('/students/:id/groupmates', students.findAllGroupMates);

router.get('/students/:id/lectures', students.findAllStudentLectures);

module.exports = router;
