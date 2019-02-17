const getMentionedStudents = require("./../getMentionedStudents");

const testNotification1 = "Hello! @foo@example.com @bar@example.com";
const testNotification2 = "Hello! @foo@example.com";
const testNotification3 = "Hello!";

it("should return extract foo and bar", () => {
  const res = getMentionedStudents(testNotification1);
  const expectedSet = new Set(["foo@example.com", "bar@example.com"]);
  expect(new Set(res)).toEqual(expectedSet);
});

it("should return extract foo", () => {
  const res = getMentionedStudents(testNotification2);
  const expected = ["foo@example.com"];
  expect(res).toEqual(expected);
});

it("should return an empty array", () => {
  const res = getMentionedStudents(testNotification3);
  expect(res).toEqual([]);
});
