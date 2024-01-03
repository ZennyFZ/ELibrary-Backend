const express = require('express');
const bookRouter = express.Router();
const bookController = require("../controllers/bookController");

//get book and category
bookRouter.get("/get-all-books", bookController.getAllBooks);
bookRouter.get("/get-book-by-id/:id", bookController.getBookById);
bookRouter.get("/get-all-categories", bookController.getAllCategories);

//CRUD (admin only)
bookRouter.post("/add-book", bookController.addBook);
bookRouter.put("/update-book/:id", bookController.updateBook);
bookRouter.delete("/delete-book/:id", bookController.deleteBook);

//filter
bookRouter.get("/filter-book", bookController.filterBookByCiteria);

//suggest
bookRouter.get("/suggest-book", bookController.suggestBookForUser);

module.exports = bookRouter;


