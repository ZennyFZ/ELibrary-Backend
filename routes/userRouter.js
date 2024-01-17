const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { isAdmin } = require('../middleware/loginChecker');
const isLogin = require("../middleware/loginChecker").isLogin;

router.post("/login", userController.Login);
router.post("/register", userController.Register);
router.get("/logout", userController.logout);
router.put("/update-profile", isLogin, userController.UpdateProfile);
router.put("/change-password", isLogin, userController.ChangePassword);
router.get("/get-current-user", isLogin, userController.getCurrentUser);
router.put("/update-user-role", isLogin, isAdmin, userController.updateUserRole);
router.get("/get-all-users", isLogin, isAdmin, userController.getAllUsers);

module.exports = router;
