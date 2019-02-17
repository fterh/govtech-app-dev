const request = require("supertest");
const config = require("./../../../config");
const { app } = require("./../index");
const { wipeTable } = require("./../../db");

beforeEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

afterEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

it("should notify registered students", done => {
  const students = ["bar1@bar.com", "bar2@bar.com", "bar3@bar.com"];
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo@foo.com",
      students
    })
    .then(() => {
      request(app)
        .post("/api/retrievefornotifications")
        .send({
          teacher: "foo@foo.com",
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
  const registeredStudents = ["bar1@bar.com", "bar2@bar.com", "bar3@bar.com"];
  const mentionedStudent1 = "mention1@domain.com";
  const mentionedStudent2 = "mention2@domain.com";
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo1@foo.com",
      students: registeredStudents
    })
    .then(() => {
      request(app)
        .post("/api/register")
        .send({
          teacher: "foo2@foo.com",
          students: [mentionedStudent1, mentionedStudent2]
        })
        .then(() => {
          request(app)
            .post("/api/retrievefornotifications")
            .send({
              teacher: "foo1@foo.com",
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
  const registeredStudents = ["bar1@bar.com", "bar2@bar.com", "bar3@bar.com"];
  const mentionedStudent1 = "mention1@domain.com";
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo@foo.com",
      students: registeredStudents
    })
    .then(() => {
      request(app)
        .post("/api/retrievefornotifications")
        .send({
          teacher: "foo@foo.com",
          notification: `Notification @${mentionedStudent1}`
        })
        .expect(400, done);
    });
});
