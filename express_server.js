const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs") // set ejs as the view engine

let generateRandomString = () => {
  let randomID = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 1; i < 6; i++) {
    randomID += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomID;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let newID = generateRandomString();
  urlDatabase[newID] = req.body["longURL"];
  res.redirect(301, `/urls/${newID}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("urls/:shortURL/update", (req, res) => {
  // urlDatabase[req.params.shortURL] = 
  console.log(req.body);
  res.redirect("/urls");
  // res.redirect(301, `/urls/${req.params.shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log((`TinyApp listening on port ${PORT}!`));
});