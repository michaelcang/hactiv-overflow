const router = require("express").Router();
const loginController = require("../controllers/loginController")
const authentication = require("../middlewares/authentication")

router.get("/", function(req, res) {
  res.status(200).send("Homepage");
});

router.post("/login", authentication, loginController.login)
router.post("/register", loginController.register)

module.exports = router;
