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
  } catch {
    res.status(500).send({
      message: 'You must provide a "teacher" property'
    });
    return;
  }
  try {
    notification = extractFromObject("notification", payload);
  } catch {
    res.status(500).send({
      message: 'You must provide a "notification" property'
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
      const allStudents = Array.from(allStudentsSet);

      // Remove suspended students
      const studentStatuses = {}; // Dictionary mapping student to suspension status
      const promises = [];
      allStudents.forEach(student => {
        promises.push(
          isStudentSuspended(student).then(suspended => {
            studentStatuses[student] = suspended;
          })
        );
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
        .catch(e => {
          console.error(e);
          res.status(500).send({
            message: "Something went wrong internally"
          });
        });
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        message: "Something went wrong internally"
      });
    });
}

module.exports = post;