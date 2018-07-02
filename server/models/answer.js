const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let answerSchema = new Schema(
  {
    body: {
      type: String,
      required: [true, 'Body is required']
    },
    author: {
      type: String,
      required: [true, 'Author is required']
    },
    upvote: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
        default: []
      }
    ],
    downvote: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
        default: []
      }
    ],
    confirm: {
      type: Boolean,
      default: false
    },
    question: Schema.Types.ObjectId
  },
  { timestamps: true }
);

module.exports = mongoose.model("answers", answerSchema);