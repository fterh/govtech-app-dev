const config = require("./../../../../config");
const extractFromObject = require("./../../../utils/extractFromObject");
const {
  writeToTeachersDatabase,
  readFromTeachersDatabase,
  writeToStudentsDatabase
} = require("./../../../db");

function post(req, res) {
  const payload = req.body;
  let teacher;
  let students;
  try {
    teacher = extractFromObject("teacher", payload);
    students = extractFromObject("students", payload);
  } catch {
    res.status(400).send({
      message: config.constants.INVALID_REQUEST_BODY
    });
    return;
  }

  readFromTeachersDatabase(teacher)
    .then(existingStudents => {
      // Avoid writing duplicate records to database
      const existingStudentsUnderTeacher = new Set(existingStudents);
      const allStudentsToBeAdded = new Set(students);

      const newStudentsToBeAdded = new Set(
        [...allStudentsToBeAdded].filter(
          i => !existingStudentsUnderTeacher.has(i)
        )
      );

      return Array.from(newStudentsToBeAdded);
    })
    .then(studentsToAdd => {
      studentsToAdd.forEach(student => {
        writeToTeachersDatabase(teacher, student);
        writeToStudentsDatabase(student, false);
      });

      res.status(204).send();
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        message: "Something went wrong internally"
      });
    });
}

module.exports = post;
