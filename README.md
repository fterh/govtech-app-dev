# govtech-app-dev
GeekInsider TAP 2019 Assessment programming exercise :)

## Setting up
1. Clone the repo (`git clone https://github.com/fterh/govtech-app-dev`)
2. `cd` into the directory, then run `npm install`
3. Run `npm start`
4. The server is now live and responsive at `http://localhost:3000` :)

## Testing
1. Run `npm test`
2. Watch the tests pass
 
**Note:** ESLint will warn about `no-console` violations. That's intentional; for the purposes of this exercise, I made the design decision to error-log to standard output.

## Explanatory notes
Unfortunately, I couldn't get MySQL to work on my computer. I opted to use SQLite instead, since they are largely similar and rely on SQL.

In the repository, `template.db` is the base template database file used to create `main.db` and `test.db`. The instructions to create `template.db` are:

1. Create template.db with `sqlite3 template.db`. Then run the following commands:
2. `CREATE TABLE teachers (
  teacher_email TEXT NOT NULL,
  student_email TEXT NOT NULL 
);`
3. `CREATE INDEX idx_teacher_email ON teachers(teacher_email);`
4. `CREATE TABLE students (
  student_email TEXT NOT NULL,
  suspended_status TEXT NOT NULL
);`
5. `CREATE INDEX idx_student_email ON students(student_email);`

