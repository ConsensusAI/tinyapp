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

const userIDGenerator = () => {
  let newUserID = generateRandomString(5);
  if (users[newUserID]) {
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

const compareEmailExistence = (checkEmail) => {
  for (let userID in users) {
    if (users[userID]["email"] === checkEmail) {
      return true;
    }
  }
  return false;
};

const checkEmailExistence = () => {
  for (let userID in users) {
    if (
      users[userID]["email"] ||
      users[userID]["email"] !== undefined ||
      users
    ) {
      return true;
    }
  }
  return false;
};

const urlsForUser = (id) => {
  let userURLs = {};
  for (let shortURLs in urlDatabase) {
    if (shortURLs["user_id"] === id) {
      userURLs[shortURLs] = shortURLs;
    }
  }
  return userURLs;
};

module.exports = {
  generateRandomString,
  userIDGenerator,
  getUserByEmail,
  compareEmailExistence,
  checkEmailExistence,
  urlsForUser,
};
