const config = require("./../../../../config");
const extractFromObject = require("./../../../utils/extractFromObject");
const { markStudentSuspension } = require("./../../../db");

function post(req, res) {
  const payload = req.body;
  let studentToSuspend;
  try {
    studentToSuspend = extractFromObject("student", payload);
  } catch {
    res.status(400).send({
      message: config.constants.INVALID_REQUEST_BODY
    });
    return;
  }

  if (typeof studentToSuspend !== "string") {
    res.status(400).send({
      message: "`student` must be a string"
    });
  }

  markStudentSuspension(studentToSuspend, true);

  res.status(204).send();
}

module.exports = post;
