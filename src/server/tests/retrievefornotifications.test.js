const request = require("supertest");
const config = require("./../../../config");
const { app } = require("./../index");
const { wipeTable, isStudentSuspended } = require("./../../db");

beforeEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

afterEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

it("should notify registered students", done => {
  const students = ["bar1", "bar2", "bar3"];
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students
    })
    .then(() => {
      request(app)
        .post("/api/retrievefornotifications")
        .send({
          teacher: "foo",
          notification: "Notification"
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(new Set(res.body.recipients)).toEqual(new Set(students));

          done();
        });
    });
});

it("should notify registered students and existent mentioned students", done => {
  const registeredStudents = ["bar1", "bar2", "bar3"];
  const mentionedStudent1 = "mention1";
  const mentionedStudent2 = "mention2";
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo1",
      students: registeredStudents
    })
    .then(() => {
      request(app)
        .post("/api/register")
        .send({
          teacher: "foo2",
          students: [mentionedStudent1, mentionedStudent2]
        })
        .then(() => {
          request(app)
            .post("/api/retrievefornotifications")
            .send({
              teacher: "foo1",
              notification: `Notification @${mentionedStudent1} @${mentionedStudent2}`
            })
            .expect(200)
            .end((err, res) => {
              if (err) {
                throw err;
              }
              expect(new Set(res.body.recipients)).toEqual(
                new Set([
                  ...registeredStudents,
                  mentionedStudent1,
                  mentionedStudent2
                ])
              );

              done();
            });
        });
    });
});

it("should not notify mentioned non-existent students", done => {
  const registeredStudents = ["bar1", "bar2", "bar3"];
  const mentionedStudent1 = "mention1";
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: registeredStudents
    })
    .then(() => {
      request(app)
        .post("/api/retrievefornotifications")
        .send({
          teacher: "foo",
          notification: `Notification @${mentionedStudent1}`
        })
        .expect(400, done);
    });
});

// don't notify mentioned but non-existent students

// missing teacher or notification -> 400
