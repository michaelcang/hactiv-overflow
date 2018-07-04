const router = require("express").Router();
const questionController = require("../controllers/questionController")
const userValidation = require('../middlewares/userValidation')

router.get("/", questionController.getQuestions);
router.get("/:id", questionController.getOneQuestion);
router.post("/", userValidation, questionController.addQuestion);
router.put("/:id", userValidation, questionController.updateQuestion);
router.delete("/:questionId", userValidation, questionController.deleteQuestion);

module.exports = router;
