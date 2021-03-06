const router = require('express').Router();

const { teachers } = require('../../controllers');

router.get('/teachers', teachers.findAll);

router.get('/teachers/:id', teachers.findOne);

router.put('/teachers/:id', teachers.update);

router.post('/teachers', teachers.create);

router.delete('/teachers/:id', teachers.delete);

router.get('/teachers/:id/lectures', teachers.findAllLecturesOfTeacher);

module.exports = router;
