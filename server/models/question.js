const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let questionSchema = new Schema(
  {
    title: {
      type: String,
      required: ['true', 'Title is required']
    },
    body: {
      type: String,
      required: ['true', 'Body is required']
    },
    author: {
      type: String,
      required: ['true', 'Author is required']
    },
    upvote: [
      {
        type: String,
        default: []
      }
    ],
    downvote: [
      {
        type: String,
        default: []
      }
    ],
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "answers",
        default: []
      }
    ],
    answered: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("questions", questionSchema);