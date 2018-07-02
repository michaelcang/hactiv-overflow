const router = require("express").Router();
const questionController = require("../controllers/questionController")
const userValidation = require('../middlewares/userValidation')

router.get("/", questionController.getQuestions);
router.get("/:id", questionController.getOneQuestion);
router.post("/", questionController.addQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:questionId", questionController.deleteQuestion);

module.exports = router;
