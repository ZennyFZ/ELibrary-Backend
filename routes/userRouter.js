const express = require('express');
const userRouter = express.Router();
const userController = require("../controllers/userController");
const { isAdmin } = require('../middleware/loginChecker');
const isLogin = require("../middleware/loginChecker").isLogin;

userRouter.post("/login", userController.Login);
userRouter.post("/register", userController.Register);
userRouter.get("/logout", userController.logout);
userRouter.put("/update-profile", isLogin, userController.UpdateProfile);
userRouter.put("/change-password", isLogin, userController.ChangePassword);
userRouter.get("/get-current-user", isLogin, userController.getCurrentUser);
userRouter.put("/update-user-role", isLogin, isAdmin, userController.updateUserRole);
userRouter.get("/get-all-users", isLogin, isAdmin, userController.getAllUsers);
userRouter.post("/checkExistBook/:id", isLogin, userController.isExistInBookList);
userRouter.get("/get-books/:id", isLogin, userController.getBooksByUserId);
userRouter.post("/write-log", isLogin, userController.writeLog);

module.exports = userRouter;
