const request = require("supertest");
const config = require("./../../../config");
const { app } = require("./../index");
const { readFromTeachersDatabase,
  writeToTeachersDatabase,
  wipeTable } = require("./../../db");

beforeEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

afterEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

it("should return 0 students if teacher is non-existent", done => {
  request(app)
    .get("/api/commonstudents")
    .query({teacher: "nonExistentTeacher"})
    .expect(200)
    .expect({
      students: []
    })
    .end(() => {
      done();
    });
});

it("should return all the students of an existing teacher", done => {
  const students = ["bar1", "bar2", "bar3"];

  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: students
    })
    .then(() => {
      request(app)
        .get("/api/commonstudents")
        .query({teacher: "foo"})
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(new Set(res.body.students)).toEqual(new Set(students));
    
          done();
        });
    });
});

it("should return all the students of an existing teacher", done => {
  const students = ["bar1", "bar2", "bar3"];

  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: students
    })
    .then(() => {
      request(app)
        .get("/api/commonstudents")
        .query({teacher: "foo"})
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(new Set(res.body.students)).toEqual(new Set(students));
    
          done();
        });
    });
});

it("should return the intersection of 2 teachers' students", done => {
  const students1 = ["bar1", "bar2", "bar3"];
  const students2 = ["bar2", "bar5", "bar6"];

  request(app)
    .post("/api/register")
    .send({
      teacher: "foo1",
      students: students1
    })
    .then(() => {
      request(app)
        .post("/api/register")
        .send({
          teacher: "foo2",
          students: students2
        })
        .then(() => {
          request(app)
          .get("/api/commonstudents")
          .query({
            teacher: ["foo1", "foo2"]
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            expect(res.body.students).toEqual(["bar2"]);
            
            done();
          });
        });
    });
});
