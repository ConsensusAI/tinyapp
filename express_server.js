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

// Home, redirects to URLs
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// JSON format of URLs
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// URLs Home Page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});

// Create new URL page
app.get("/urls/new", (req, res) => {
  if (!users[req.session.user_id]) {
    // Redirect to login if user is not logged in
    res.redirect("/login");
  } else {
    const templateVars = {
      user: users[req.session.user_id],
    };
    res.render("urls_new", templateVars);
  }
});

// Page for shortened URL
app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    // Redirect to login if user is not logged in
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

// Login Page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("login", templateVars);
});

// POST new shortened URL
app.post("/urls", (req, res) => {
  console.log(req.body);
  let newID = generateRandomString(6);
  urlDatabase[newID] = {
    longURL: req.body["longURL"],
    user_id: req.session.user_id,
  };
  res.redirect(301, `/urls/${newID}`); // Redirect to its own page
});

// Used for updating a longURL associated with a shortURL
app.post("/urls/:shortURL", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect("/login");
  } else {
    urlDatabase[req.params.shortURL]["longURL"] = req.body["newlongURL"];
    res.redirect(301, `/urls/${req.params.shortURL}`);
  }
});

// Used to delete shortURL
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

// Used to log in
app.post("/login", (req, res) => {
  // Check if email exists in database
  if (compareEmailExistence(req.body["email"], users)) {
    let user = getUserByEmail(req.body["email"], users);
    // Check if passwords match
    if (bcrypt.compareSync(req.body["password"], users[user]["password"])) {
      req.session.user_id = users[user]["id"];
      res.redirect("/urls");
    } else {
      // Redirect to urls if password don't match
      res.status(403);
      res.redirect("/urls");
    }
  } else {
    // Redirect to urls if email doesn't exist
    res.status(403);
    res.redirect("/urls");
  }
});

// Logout Page
app.post("/logout", (req, res) => {
  req.session = null; // Destroys the session
  res.redirect("/urls");
});

// Register Page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("register", templateVars);
});

// POST new user info
app.post("/register", (req, res) => {
  let checkEmail = req.body["email"];
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
});

// Redirects to longURL from shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

// Easter Egg
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Confirmation of Listening
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
