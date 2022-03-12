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

const userIDGenerator = (database) => {
  let newUserID = generateRandomString(5);
  if (database[newUserID]) {
    userIDGenerator();
  }
  return newUserID;
};

const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user]["email"] === email) {
      return user;
    }
  }
};

const compareEmailExistence = (checkEmail, database) => {
  for (let userID in database) {
    if (database[userID]["email"] === checkEmail) {
      return true;
    }
  }
  return false;
};

const urlsForUser = (id, database) => {
  let userURLs = {};
  for (let shortURLs in database) {
    console.log(shortURLs);
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
