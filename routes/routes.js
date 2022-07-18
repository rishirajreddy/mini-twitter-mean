const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const middleware = require("../middlewares/middleware");


//get all users
router.route("/getAll").get(authController.getAllUsers);

//registering user
router.route("/register").post(authController.registerUser);

//signing in user
router.route("/login").post(authController.loginUser);

//updating user
router.route("/update").patch(middleware.checkToken,authController.updateUser);
module.exports = router;