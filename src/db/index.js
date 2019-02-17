const sqlite3 = require("sqlite3").verbose();
const config = require("./../../config");

// Set up
const db = new sqlite3.Database(config.database.name, err => {
  if (err) console.error(err);
  console.log(`Connected to ${config.database.name}`);
});

/**
 * Writes `teacher` and `student` to the `teachers` database.
 * @param {string} teacher
 * @param {string} student
 */
function writeToTeachersDatabase(teacher, student) {
  const sql = `INSERT INTO teachers (teacher_email, student_email) \
    VALUES ("${teacher}", "${student}")`;
  db.run(sql);
}

/**
 * Returns a Promise that resolves to an array of students associated
 * with `teacher` in the `teachers` database.
 * @param {string} teacher
 */
function readFromTeachersDatabase(teacher) {
  const sql = `SELECT * FROM teachers WHERE teacher_email = "${teacher}"`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);

      const students = [];
      rows.forEach(row => {
        students.push(row.student_email);
      });

      resolve(students);
    });
  });
}

/**
 * Adds a student into the students database.
 * @param {string} student
 * @param {boolean} suspendedStatus
 */
function writeToStudentsDatabase(student, suspendedStatus) {
  const suspendedStatusConverted = suspendedStatus ? "1" : "0";
  const sql = `INSERT INTO students (student_email, suspended_status)
    VALUES ("${student}", "${suspendedStatusConverted}")`;
  db.run(sql);
}

/**
 * Marks `student` as either suspended or not.
 * @param {string} student
 * @param {boolean} suspensionStatus
 */
function markStudentSuspension(student, suspensionStatus) {
  const suspensionStatusConverted = suspensionStatus ? "1" : "0";
  const sql = `Update students
    SET suspended_status = "${suspensionStatusConverted}"
    WHERE student_email = "${student}"`;
  db.run(sql);
}

/**
 * Returns a Promise that resolves to a boolean whether `student` is suspended.
 * @param {*} student
 */
function isStudentSuspended(student) {
  const sql = `SELECT * FROM students WHERE student_email = "${student}"`;
  return new Promise((resolve, reject) => {
    db.get(sql, (err, result) => {
      if (err) reject(err);
      if (result.suspended_status === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Deletes all rows in a database table.
 * @param {string} tableName
 */
function wipeTable(tableName) {
  const sql = `DELETE FROM "${tableName}"`;
  db.run(sql);
}

module.exports = {
  writeToTeachersDatabase,
  readFromTeachersDatabase,
  writeToStudentsDatabase,
  markStudentSuspension,
  isStudentSuspended,
  wipeTable
};
