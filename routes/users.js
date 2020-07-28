const express = require("express");
const router = express.Router();

const login = require("../middleware/login");

const UsersController = require("../controllers/users-controller");

router.post("/signUp", UsersController.signUp);
router.post("/login", UsersController.login);
router.post("/addToMyList", login.required, UsersController.addToMyList);
router.get("/getMyList", login.required, UsersController.getMyList);

module.exports = router;
