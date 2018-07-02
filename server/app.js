require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

const indexRouter = require("./routes/index");
const questionRouter = require("./routes/question");
const answerRouter = require("./routes/answer");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const { DB_USER, DB_PASS } = process.env;

const url = `mongodb://${DB_USER}:${DB_PASS}@ds161960.mlab.com:61960/h-overflow`;

mongoose.connect(url).then(()=> {
  console.log('connected to db')
});

app.use("/", indexRouter);
app.use("/question", questionRouter);
app.use("/answer", answerRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("listening in port 3000");
});
