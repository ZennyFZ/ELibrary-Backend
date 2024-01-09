const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const isLogin = require("../middleware/loginChecker").isLogin;

router.post("/login", userController.Login);
router.post("/register", userController.Register);
router.put("/update-profile", isLogin, userController.UpdateProfile);
router.put("/change-password", isLogin, userController.ChangePassword);
router.get("/get-current-user", isLogin, userController.getCurrentUser);

module.exports = router;
