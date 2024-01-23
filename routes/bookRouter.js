const express = require('express');
const bookRouter = express.Router();

//firebase
const {initializeApp} = require('firebase/app');
const config = require('../config/firebase');
initializeApp(config.firebaseConfig);

const bookController = require("../controllers/bookController");
const { isLogin, isAdmin } = require('../middleware/loginChecker');
const upload = require('../middleware/upload');

////////////////////////////////////////////////////////////////////////////////////////

//get book and category
bookRouter.get("/get-all-books", bookController.getAllBooks);
bookRouter.get("/get-all-categories", bookController.getAllCategories);
bookRouter.get("/get-pdf/:id", isLogin, bookController.getBookFile); // chưa có isOwned

//CRUD (admin only)
bookRouter.post("/add-book", isLogin, isAdmin, bookController.addBook);
bookRouter.post("/upload-book-image", isLogin, isAdmin, upload.single('image') , bookController.uploadBookImage);
bookRouter.post("/upload-book-file", isLogin, isAdmin, upload.single('file') , bookController.uploadBookFile);
bookRouter.put("/update-book/:id", isLogin, isAdmin, bookController.updateBook);
bookRouter.delete("/delete-book/:id", isLogin, isAdmin, bookController.deleteBook);

//filter
bookRouter.get("/filter-book", bookController.filterBookByCategory);
bookRouter.get("/search", bookController.searchBookByName);

//suggest
bookRouter.post("/suggest-book", isLogin, bookController.suggestBookForUser);

bookRouter.get("/:id", bookController.getBookById);

module.exports = bookRouter;


