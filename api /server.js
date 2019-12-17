const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const sessions = require("express-session"); // <<<<< install express-session
const KnexSessionStore = require("connect-session-knex")(sessions);
const authRouter = require("../auth/auth-router.js"); //set to use auth-router file ** this file is used to make request to a authorized end point
const usersRouter = require("../users/users-router.js"); //set to use a user-router file
const server = express();
const knex = require("*_link to data base _* dbConfig.js");
const sessionConfiguration = {
  // session storage options
  name: "add name to session id ", // default would be sid
  secret: "add a secret ", // used for encryption (must be an environment variable)
  saveUninitialized: true, // has implications with GDPR laws
  resave: false,

  store: new KnexSessionStore({
    knex,
    tablename: "sessions",
    createtable: true,
    clearInterval: 1000 * 60 * 10
  }),
  // cookie options
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
    secure: false, // if false the cookie es sent over http, if true only sent over https
    httpOnly: true // if true JS cannot access the cookie
  }
};
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration)); // add a req.session object
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.get("/", (req, res) => {
  res.json({ api: "up" });
});
module.exports = server;
