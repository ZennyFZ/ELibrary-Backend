const express = require('express');
const categoryRouter = express.Router();
const categoryController = require("../controllers/categoryController");
const { isLogin, isAdmin } = require('../middleware/loginChecker');

categoryRouter.post("/add-category", isLogin, isAdmin, categoryController.addCategory);
categoryRouter.get("/get-all-categories", isLogin, categoryController.getAllCategories);
categoryRouter.put("/update-category", isLogin, isAdmin, categoryController.updateCategory);
categoryRouter.delete("/delete-category/:id", isLogin, isAdmin, categoryController.deleteCategory); 
categoryRouter.delete("/delete-category", isLogin, isAdmin, categoryController.deleteCategory); 

module.exports = categoryRouter;