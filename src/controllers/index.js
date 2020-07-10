const groups = require('./groups/groups.controller');
const lectures = require('./lectures/lectures.controller');
const students = require('./students/students.controller');
const teachers = require('./teachers/teachers.controller');

module.exports = {
  groups, lectures, students, teachers,
};
