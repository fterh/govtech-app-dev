const extractFromObject = require("./../extractFromObject");

const emptyObject = {};
const testObject = {
  foo: "bar"
};

it("should throw 1", () => {
  expect(() => {
    extractFromObject("foo", emptyObject);
  }).toThrow();
});

it("should throw 2", () => {
  expect(() => {
    extractFromObject("bar", testObject);
  }).toThrow();
});

it("should return bar", () => {
  const res = extractFromObject("foo", testObject);
  expect(res).toBe("bar");
});
