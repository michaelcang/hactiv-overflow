const mongoose = require("mongoose");
const { question } = require("../models");

module.exports = {
  getQuestions: function(req, res) {
    question
      .find()
      .sort({ createdAt: -1 })
      .then(questions => {
        res.status(200).json({
          msg: "successfully get question list",
          questions
        });
      })
      .catch(err => {
        if (err) {
          res.status(400).json(err);
        }
      });
  },
  getOneQuestion: function(req, res) {
    let questionId = req.params.id;
    question
      .findById(questionId)
      .populate("answers")
      .then(question => {
        res.status(200).json({
          msg: "successfully get one question",
          question
        });
      })
      .catch(err => {
        if (err) {
          res.status(400).json(err);
        }
      });
  },
  addQuestion: function(req, res) {
    let payload = {
      title: req.body.title,
      body: req.body.body,
      author: req.body.author
    };
    question
      .create(payload)
      .then(question => {
        res.status(201).json({
          msg: "successfully add new question",
          question
        });
      })
      .catch(err => {
        if (err) {
          res.send(err.errors);
        }
      });
  },
  deleteQuestion: function(req, res) {
    let questionId = req.params.questionId;
    question
      .findByIdAndRemove(questionId)
      .then(question => {
        res.status(200).json({
          msg: "successfully remove question",
          question
        });
      })
      .catch(err => {
        if (err) {
          res.status(400).json(err);
        }
      });
  },
  updateQuestion: function(req, res) {
    let questionId = req.params.id;
    let updatedQuestion = {};
    if (req.body.title) {
      updatedQuestion.title = req.body.title;
    }
    if (req.body.body) {
      updatedQuestion.body = req.body.body;
    }
    question
      .findByIdAndUpdate(questionId, { $set: updatedQuestion }, { new: true })
      .then(question => {
        res.status(200).json({
          msg: "successfully update question",
          question
        });
      })
      .catch(err => {
        if (err) {
          res.send(err);
        }
      });
  }
};
