const express = require("express");
const { v4 } = require('uuid');

const app = express();
app.use(express.json());

const courses = [];

app.get('/courses', (request, response) => {
  return response.json(courses);
});

app.post('/courses', (request, response) => {
  const { name, teacher } = request.body;
  const course = {id: v4(), name, teacher };

  courses.push(course);

  return response.json(course);
});

app.put('/courses/:id', (request, response) => {
  const { id } = request.params;
  const { name, teacher } = request.body;

  const indexCourse = courses.findIndex(course => course.id === id);

  if (indexCourse < 0) {
    return response.status(400).json('Course not found!');
  }

  const course = {
    id,
    name,
    teacher
  }

  courses[indexCourse] = course;
  return response.json(course);
});

app.delete('/courses/:id', (request, response) => {
  const { id } = request.params;

  const indexCourse = courses.findIndex(course => course.id === id);

  if (indexCourse < 0) {
    return response.status(400).json('Course not found');
  }

  courses.splice(indexCourse, 1);

  return response.status(204).send();
});

app.listen(3334, () => {
  console.log('Back-end started!')
});