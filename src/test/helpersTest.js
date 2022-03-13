const { assert } = require("chai");

const {
  getUserByEmail,
  compareEmailExistence,
  urlsForUser,
} = require("../helpers");

// Object used for testing
const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// Object used for testing
const testUrlDatabase = {
  short: { longURL: "www.test.com", user_id: "user" },
  short2: { longURL: "www.lighthouselabs.com", user_id: "lighthouse" },
  bitly: { longURL: "www.bit.ly.com", user_id: "user" },
};

describe("getUserByEmail", () => {
  it("should return a user with valid email", () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expected = "userRandomID";

    assert.equal(user, expected);
  });

  it("should return aundefined for a non-existent email", () => {
    const user = getUserByEmail("monkeys@example.com", testUsers);
    const expected = undefined;

    assert.equal(user, expected);
  });
});

describe("compareEmailExistence", () => {
  it("should return true if the email exists in the database", () => {
    const email = "user2@example.com";

    assert.isTrue(compareEmailExistence(email, testUsers));
  });

  it("should return false if the email doesn't exist in the database", () => {
    const email = "test@example.com";

    assert.isFalse(compareEmailExistence(email, testUsers));
  });

  describe("urlsForUser", () => {
    it("should return the right shortURLs for a user", () => {
      const userID = "user";
      const expected = {
        short: { longURL: "www.test.com", user_id: "user" },
        bitly: { longURL: "www.bit.ly.com", user_id: "user" },
      };

      assert.deepEqual(urlsForUser(userID, testUrlDatabase), expected);
    });
  });
});
