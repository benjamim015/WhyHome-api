const express = require("express");
const router = express.Router();

const login = require("../middleware/login");

const UsersController = require("../controllers/users-controller");

router.post("/emailVerification", UsersController.emailVerification);
router.get("/signUp", UsersController.signUp);
router.post("/login", UsersController.login);
router.post("/addToMyList", login.required, UsersController.addToMyList);
router.post("/getMyList", login.required, UsersController.getMyList);
router.post("/addRatingTo", login.required, UsersController.addRatingTo);
router.post(
  "/removeFromMyList",
  login.required,
  UsersController.removeFromMyList
);

module.exports = router;
