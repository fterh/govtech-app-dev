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
            message: "Something went wrong internally"
          });
        });

      break;
    }

    case "object": {
      // Multiple `teachers` are provided
      const allStudents = [];
      const promises = [];

      teachers.forEach(teacher => {
        promises.push(helper(teacher));
      });

      Promise.all(promises)
        .then(studentsArr => {
          studentsArr.forEach(students => {
            students.forEach(student => {
              allStudents.push(student);
            });
          });

          res.status(200).send({
            students: allStudents
          });
        })
        .catch(e => {
          console.error(e);
          res.status(500).send({
            message: "Something went wrong internally"
          });
        });

      break;
    }

    default:
      res.status(500).send({
        message: "Something went wrong internally"
      });
  }
}

module.exports = get;
