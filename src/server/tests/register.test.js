const request = require("supertest");
const config = require("./../../../config");
const { app } = require("./../index");
const { readFromTeachersDatabase, wipeTable } = require("./../../db");

beforeEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

afterEach(() => {
  wipeTable(config.database.table.teachers);
  wipeTable(config.database.table.students);
});

it("should register 0 students", done => {
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: []
    })
    .expect(204)
    .end(err => {
      if (err) {
        throw err;
      }

      readFromTeachersDatabase("foo")
        .then(students => {
          expect(students).toEqual([]);
          done();
        })
        .catch(e => {
          throw e;
        });
    });
});

it("should register 1 student", done => {
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: ["student1"]
    })
    .expect(204)
    .end(err => {
      if (err) {
        throw err;
      }

      readFromTeachersDatabase("foo")
        .then(students => {
          expect(students).toEqual(["student1"]);
          done();
        })
        .catch(e => {
          throw e;
        });
    });
});

it("should register multiple students", done => {
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: ["student1", "student2", "student3"]
    })
    .expect(204)
    .end(err => {
      if (err) {
        throw err;
      }

      readFromTeachersDatabase("foo")
        .then(students => {
          expect(new Set(students)).toEqual(
            new Set(["student1", "student2", "student3"])
          );
          done();
        })
        .catch(e => {
          throw e;
        });
    });
});

it("should not register duplicate students", done => {
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: ["student1", "student2", "student1"]
    })
    .expect(204)
    .end(err => {
      if (err) {
        throw err;
      }

      readFromTeachersDatabase("foo")
        .then(students => {
          expect(new Set(students)).toEqual(new Set(["student1", "student2"]));
          done();
        })
        .catch(e => {
          throw e;
        });
    });
});

it("should not register students who are already registered", done => {
  request(app)
    .post("/api/register")
    .send({
      teacher: "foo",
      students: ["student1"]
    })
    .then(() => {
      request(app)
        .post("/api/register")
        .send({
          teacher: "foo",
          students: ["student1"]
        })
        .expect(204)
        .end(err => {
          if (err) {
            throw err;
          }

          readFromTeachersDatabase("foo")
            .then(students => {
              expect(students).toEqual(["student1"]);
              done();
            })
            .catch(e => {
              throw e;
            });
        });
    });
});
