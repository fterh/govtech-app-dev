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

it("should suspend an existing student", done => {
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: ["bar"]
    })
    .then(() => {
      request(app)
        .post("/api/suspend")
        .send({
          student: "bar"
        })
        .expect(204)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          isStudentSuspended("bar").then(res => {
            expect(res).toBe(true);
            done();
          });
        });
    });
});
