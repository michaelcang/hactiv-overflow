const router = require("express").Router();
const answerController = require("../controllers/answerController")
const userValidation = require('../middlewares/userValidation')

router.post("/:questionId", userValidation, answerController.addAnswer);
router.put("/:answerId", userValidation, answerController.updateAnswer);
router.delete("/:answerId", userValidation, answerController.deleteAnswer);

module.exports = router;
