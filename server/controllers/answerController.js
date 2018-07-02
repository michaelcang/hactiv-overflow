const mongoose = require("mongoose");
const { question, answer } = require("../models");

module.exports = {
  addAnswer: function(req, res) {
    let questionId = req.params.questionId;
    let payload = {
      title: req.body.title,
      body: req.body.body,
      author: req.body.author,
      question: questionId
    }
    answer
      .create(payload)
      .then(answer => {
        question.findById(questionId).then(question => {
          let answerId = answer._id;
          question.answers.push(answerId);
          question.save().then(question => {
            res.status(200).json({
              msg: "successfully add answer and update question",
              question
            });
          });
        });
      })
      .catch(err => {
        if (err) {
          res.send(err.errors);
        }
      });
  },
  deleteAnswer: function(req, res) {
    let answerId = req.params.answerId;
    answer
      .findByIdAndRemove(answerId)
      .then(answer => {
        question
          .findById(answer.question)
          .then(question => {
            question.answers.pull(answerId);
            question.answers.pull(null);
            question.save()
            res.status(200).json({
              msg: "successfully remove question",
              question
          })
        });
      })
      .catch(err => {
        if (err) {
          res.status(400).json(err);
        }
      });
  },
  updateAnswer: function(req, res) {
    let answerId = req.params.answerId;
    let updatedAnswer = {};
    if (req.body.title) {
      updatedAnswer.title = req.body.title;
    }
    if (req.body.body) {
      updatedAnswer.body = req.body.body;
    }
    answer
      .findByIdAndUpdate(answerId, { $set: updatedAnswer }, { new: true })
      .then(answer => {
        res.status(200).json({
          msg: "successfully update answer",
          answer
        });
      })
      .catch(err => {
        if (err) {
          res.send(err);
        }
      });
  }
};
