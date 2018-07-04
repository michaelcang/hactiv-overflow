const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");
const kue = require("kue");
const queue = kue.createQueue();

module.exports = {
  register: function(req, res) {
    let hash;
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
            let job = queue
              .create("sendEmail", {email, name})
              .attempts(5)
              .save(function(err) {
                if (!err) {
                  console.log(job.id);
                } else {
                  console.log(err);
                }
              });
            res.status(201).json({
              msg: "successfully create new user",
              token,
              email,
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
      email,
      name
    });
  },
  fbLogin: function(req, res) {
    user
      .findOne({ email: req.body.email })
      .then(result => {
        if (result) {
          let email = result.email;
          let name = result.name;
          let token = jwt.sign({ email }, process.env.SECRET_KEY);
          res.status(201).json({
            msg: "fb login successful",
            token,
            email,
            name,
            new: false
          });
        } else {
          let salt = bcrypt.genSaltSync(7);
          let hash = bcrypt.hashSync(req.body.password, salt);
          user
            .create({
              name: req.body.name,
              email: req.body.email,
              password: hash
            })
            .then(newUser => {
              let email = newUser.email;
              let name = newUser.name;
              let token = jwt.sign({ email }, process.env.SECRET_KEY);
              let job = queue
              .create("sendEmail", {email, name})
              .attempts(5)
              .save(function(err) {
                if (!err) {
                  console.log(job.id);
                } else {
                  console.log(err);
                }
              });
              res.status(201).json({
                msg: "add new account via fb",
                token,
                email,
                name,
                new: true
              });
            });
        }
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      });
  }
};
