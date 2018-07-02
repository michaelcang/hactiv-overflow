const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = {
  register: function(req, res) {
    let hash = "";
    let email = req.body.email;
    if (req.body.password !== "") {
      let salt = bcrypt.genSaltSync(7);
      hash = bcrypt.hashSync(req.body.password, salt);
    }
    let userInfo = {
      email,
      password: hash,
      name: req.body.name
    };
    user.findOne({ email }).then(found => {
      if (found) {
        res.send({ err: { message: "email is used" } });
      } else {
        user
          .create(userInfo)
          .then(newUser => {
            let email = newUser.email;
            let name = newUser.name;
            let token = jwt.sign({ email }, process.env.SECRET_KEY);
            res.status(201).json({
              msg: "successfully create new user",
              token,
              name
            });
          })
          .catch(err => {
            res.send(err.errors);
          });
      }
    });
  },
  login: function(req, res) {
    let email = req.body.email;
    let name = req.body.name;
    let token = jwt.sign({ email }, process.env.SECRET_KEY);
    res.status(200).json({
      message: "successfully sign in",
      token,
      name
    });
  }
};
