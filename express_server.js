// Set up Express
const express = require("express");
const app = express();
const req = require("express/lib/request");
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // set ejs as the view engine

// nodemon to refresh running server and test changes
const { reset } = require("nodemon");

const {
  generateRandomString,
  userIDGenerator,
  getUserByEmail,
  compareEmailExistence,
  urlsForUser,
} = require("./helpers");

// Cookies and Encryption
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],

    //Cookie options
    maxAge: 24 * 60 * 60 * 1000, // 24h
  })
);

// Databases
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
    user: users[req.session.user_id],
  };
  console.log("users " + JSON.stringify(users));
  // console.log("user " + JSON.stringify(users[req.cookies["user_id"]["id"]]));
  console.log(JSON.stringify(urlDatabase));
  console.log("user_id " + req.session.user_id);
  console.log("------------------------");
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect("/login");
  } else {
    const templateVars = {
      user: users[req.session.user_id],
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.redirect("/urls/new");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]["longURL"],
      user: users[req.session.user_id],
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let newID = generateRandomString(6);
  urlDatabase[newID] = {
    longURL: req.body["longURL"],
    user_id: req.session.user_id,
  };
  res.redirect(301, `/urls/${newID}`);
});

app.post("/urls/:shortURL", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect("/login");
  } else {
    urlDatabase[req.params.shortURL]["longURL"] = req.body["newlongURL"];
    console.log(req.body);
    res.redirect(301, `/urls/${req.params.shortURL}`);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect("/login");
  } else if (
    (urlsForUser(req.session.user_id)[req.params.shortURL], urlDatabase)
  ) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  if (compareEmailExistence(req.body["email"], users)) {
    let user = getUserByEmail(req.body["email"], users);
    if (bcrypt.compareSync(req.body["password"], users[user]["password"])) {
      req.session.user_id = users[user]["id"];
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
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let checkEmail = req.body["email"];
  // console.log("check email " + checkEmail);
  // console.log("post users ", users);
  // console.log("compare", compareEmailExistence(checkEmail));
  let checkPass = bcrypt.hashSync(req.body["password"], saltRounds);
  if (
    typeof checkEmail !== "string" ||
    typeof checkPass !== "string" ||
    checkEmail === ""
  ) {
    console.log("not string");
    res.status(400);
    res.redirect("/urls");
  } else if (compareEmailExistence(checkEmail, users)) {
    console.log("already exists");
    res.status(400);
    res.redirect("/urls");
  } else {
    const userID = userIDGenerator(users);
    users[userID] = {
      id: userID,
      email: req.body["email"],
      password: bcrypt.hashSync(req.body["password"], saltRounds),
    };
    req.session.user_id = userID;
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
