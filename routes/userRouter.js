const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.Login);
router.post("/register", userController.Register);
router.put("/update-profile", userController.UpdateProfile);
router.put("/change-password", userController.ChangePassword);
router.get("/get-current-user", userController.getCurrentUser);

module.exports = router;
