const router = require("express").Router();
const answerController = require("../controllers/answerController")
const userValidation = require('../middlewares/userValidation')

router.post("/:questionId", answerController.addAnswer);
router.put("/:answerId", answerController.updateAnswer);
router.delete("/:answerId", answerController.deleteAnswer);

module.exports = router;
