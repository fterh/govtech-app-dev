const config = require("./../../../../config");
const extractFromObject = require("./../../../utils/extractFromObject");
const getMentionedStudents = require("./../../../utils/getMentionedStudents");
const {
  readFromTeachersDatabase,
  isStudentSuspended
} = require("./../../../db");

function post(req, res) {
  const payload = req.body;
  let teacher;
  let notification;
  try {
    teacher = extractFromObject("teacher", payload);
    notification = extractFromObject("notification", payload);
  } catch {
    res.status(400).send({
      message: config.constants.INVALID_REQUEST_BODY
    });
    return;
  }

  const mentionedStudents = getMentionedStudents(notification);

  readFromTeachersDatabase(teacher)
    .then(students => {
      const registeredStudents = students;

      // Remove duplicates
      const allStudentsSet = new Set([
        ...mentionedStudents,
        ...registeredStudents
      ]);
      return Array.from(allStudentsSet);
    })
    .then(students => {
      // Remove suspended students
      const studentStatuses = {}; // Dictionary mapping student to suspension status
      const promises = [];
      students.forEach(student => {
        const promise = isStudentSuspended(student).then(suspended => {
          studentStatuses[student] = suspended;
        });
        promises.push(promise);
      });

      Promise.all(promises)
        .then(() => {
          const recipients = [];
          Object.entries(studentStatuses).forEach(studentStatus => {
            if (!studentStatus[1]) {
              // Not suspended
              recipients.push(studentStatus[0]);
            }
          });

          res.status(200).send({
            recipients
          });
        })
        .catch(() => {
          res.status(400).send({
            message: "At least one of the mentioned students do not exist"
          });
        });
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        message: config.constants.INTERNAL_ERROR
      });
    });
}

module.exports = post;
