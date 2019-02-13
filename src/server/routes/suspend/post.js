const extractFromObject = require("./../../../utils/extractFromObject");
const { markStudentSuspension } = require("./../../../db");

function post(req, res) {
  const payload = req.body;
  const studentToSuspend = extractFromObject("student", payload);

  if (typeof studentToSuspend !== "string") {
    res.status(400).send({
      message: "`student` must be a string"
    });
  }

  markStudentSuspension(studentToSuspend, true);

  res.status(204).send();
}

module.exports = post;
