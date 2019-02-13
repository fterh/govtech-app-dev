const sqlite3 = require("sqlite3").verbose();
const config = require("./../../config");

// Set up
const db = new sqlite3.Database(config.database.name, (err) => {
  if (err) console.error(err);
  console.log(`Connected to ${config.database.name}`);
});

function writeToTeachersDatabase(teacher, student) {
  let sql = `INSERT INTO teachers (teacher_email, student_email) \
    VALUES ("${teacher}", "${student}")`;
    db.run(sql);
}

function readFromTeachersDatabase(teacher) {
  let sql = `SELECT * FROM teachers WHERE teacher_email = "${teacher}"`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

function writeToStudentsDatabase(student, suspendedStatus) {
  let suspendedStatusConverted = suspendedStatus ? "1" : "0";
  let sql = `INSERT INTO students (student_email, suspended_status)
    VALUES ("${student}", "${suspendedStatusConverted}")`;
    db.run(sql);
}

function isStudentSuspended(student) {
  let sql = `SELECT * FROM students WHERE student_email = "${student}"`;
  return new Promise((resolve, reject) => {
    db.get(sql, (err, result) => {
      if (err) reject(err);
      if (result.suspended_status == 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = {
  writeToTeachersDatabase,
  readFromTeachersDatabase,
  writeToStudentsDatabase,
  isStudentSuspended
};
