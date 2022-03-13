// Generates a random string to use for new IDs
const generateRandomString = (length) => {
  let randomID = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 1; i < length; i++) {
    randomID += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomID;
};

// Generates a new user ID
const userIDGenerator = (database) => {
  // user IDs are 5 characters long
  let newUserID = generateRandomString(5);
  // Recursion if the ID already exists to try a new one
  if (database[newUserID]) {
    userIDGenerator();
  }
  return newUserID;
};

// Returns the userID when given an email and the database
const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user]["email"] === email) {
      return user;
    }
  }
};

// Checks to see if the email exists in the database already
const compareEmailExistence = (checkEmail, database) => {
  for (let userID in database) {
    if (database[userID]["email"] === checkEmail) {
      return true;
    }
  }
  return false;
};

// Returns an object containing all the urls for a given userID
const urlsForUser = (id, database) => {
  let userURLs = {};
  for (let shortURLs in database) {
    if (database[shortURLs]["user_id"] === id) {
      userURLs[shortURLs] = database[shortURLs];
    }
  }
  return userURLs;
};

module.exports = {
  generateRandomString,
  userIDGenerator,
  getUserByEmail,
  compareEmailExistence,
  urlsForUser,
};
