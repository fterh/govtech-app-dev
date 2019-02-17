const config = require("./../../../../config");
const { readFromTeachersDatabase } = require("./../../../db");

/**
 * Returns a Promise that resolves into an array of students associated with
 * `teacher`.
 * @param {string} teacher
 */
function helper(teacher) {
  return readFromTeachersDatabase(teacher).then(students => {
    return students;
  });
}

function get(req, res) {
  const teachers = req.query.teacher; // `teachers` could be a string or array

  switch (typeof teachers) {
    case "string": {
      // Only 1 `teacher` is provided

      helper(teachers)
        .then(students => {
          res.status(200).send({ students });
        })
        .catch(e => {
          console.error(e);
          res.status(500).send({
            message: config.constants.INTERNAL_ERROR
          });
        });

      break;
    }

    case "object": {
      // Multiple `teachers` are provided
      const promises = [];

      teachers.forEach(teacher => {
        promises.push(helper(teacher));
      });

      Promise.all(promises)
        .then(arrOfStudents => {
          const studentCount = {};

          arrOfStudents.forEach(students => {
            students.forEach(student => {
              if (!(student in studentCount)) {
                studentCount[student] = 0;
              }

              studentCount[student] += 1;
            });
          });

          const commonStudents = [];

          Object.keys(studentCount).forEach(student => {
            if (studentCount[student] === promises.length) {
              commonStudents.push(student);
            }
          });

          res.status(200).send({
            students: commonStudents
          });
        })
        .catch(e => {
          console.error(e);
          res.status(500).send({
            message: config.constants.INTERNAL_ERROR
          });
        });

      break;
    }

    default:
      res.status(500).send({
        message: config.constants.INTERNAL_ERROR
      });
  }
}

module.exports = get;
