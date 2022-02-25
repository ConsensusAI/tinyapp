const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const req = require("express/lib/request");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // set ejs as the view engine

app.use(cookieParser());

let generateRandomString = (length) => {
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

const compareEmailExistence = (checkEmail) => {
  for (let userID in users) {
    if (users[userID]["email"] === checkEmail) {
      return true;
    }
  }
  return false;
};

const getUserIDByEmail = (email) => {
  for (let userID in users) {
    if (users[userID]["email"] === email) {
      return userID;
    }
  }
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

const urlDatabase = {};

const users = {};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
    checkEmailExistence,
  };
  console.log("users " + JSON.stringify(users));
  // console.log("user " + JSON.stringify(users[req.cookies["user_id"]["id"]]));
  console.log(JSON.stringify(urlDatabase));
  console.log("user_id " + req.cookies["user_id"]);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  }
  const templateVars = {
    user: users[req.cookies["user_id"]],
    checkEmailExistence,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user: users[req.cookies["user_id"]],
    checkEmailExistence,
  };
  res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    checkEmailExistence,
  };
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let newID = generateRandomString(6);
  urlDatabase[newID] = {
    longURL: req.body["longURL"],
    userID: req.cookies["user_id"],
  };
  res.redirect(301, `/urls/${newID}`);
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body["newlongURL"];
  console.log(req.body);
  res.redirect(301, `/urls/${req.params.shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (compareEmailExistence(req.body["email"])) {
    let ID = getUserIDByEmail(req.body["email"]);
    if (users[ID]["password"] === req.body["password"]) {
      res.cookie("user_id", ID);
      res.redirect("/urls");
    } else {
      res.status(403);
      res.redirect("/urls");
    }
  } else {
    res.status(403);
    res.redirect("/urls");
  }
  // res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    checkEmailExistence,
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let checkEmail = req.body["email"];
  let checkPass = req.body["password"];
  if (
    typeof checkEmail !== "string" ||
    typeof checkPass !== "string" ||
    checkEmail === ""
  ) {
    console.log("not string");
    res.status(400);
    res.redirect("/urls");
  } else if (compareEmailExistence(checkEmail)) {
    console.log("already exists");
    res.status(400);
    res.redirect("/urls");
  } else {
    const userID = userIDGenerator();
    users[userID] = {
      id: userID,
      email: req.body["email"],
      password: req.body["password"],
    };
    res.cookie("user_id", userID);
    console.log("in register: " + JSON.stringify(users[userID]));
    res.redirect("/urls");
  }
  console.log(users);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
