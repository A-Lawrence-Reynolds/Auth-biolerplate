const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js"); // make the file here point to a model or router file

// for endpoints beginning with /api/auth
router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // save a session for the client and send back a cookie
        req.session.user = user;
        res.status(200).json({
          message: `Welcome ${user.username}!`
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.json({
          message: "error logging out ."
        });
      } else {
        res.status(200).json({
          message: "place a message to tell client they have logged out "
        });
      }
    });
  } else {
    res.status(200).json({ message: "already logged out " });
  }
});

module.exports = router;
