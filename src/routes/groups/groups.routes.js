const router = require('express').Router();

const { groups } = require('../../controllers');

router.get('/groups', groups.findAll);

router.get('/groups/:id', groups.findOne);

router.put('/groups/:id', groups.update);

router.post('/groups', groups.create);

router.delete('/groups/:id', groups.delete);

router.get('/groups/:id/students', groups.findGroupStudents);

router.get('/groups/:id/lectures', groups.findGroupLectures);

module.exports = router;
