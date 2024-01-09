const express = require('express');
const multer = require('multer');
const bookRouter = express.Router();
const bookController = require("../controllers/bookController");
const { isLogin, isAdmin } = require('../middleware/loginChecker');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage });

//get book and category
bookRouter.get("/get-all-books", bookController.getAllBooks);
bookRouter.get("/:id", bookController.getBookById);
bookRouter.get("/get-all-categories", bookController.getAllCategories);

//CRUD (admin only)
bookRouter.post("/add-book", isLogin, isAdmin, bookController.addBook);
bookRouter.post("/upload-book-image", upload.single('image') , bookController.uploadBookImage);
bookRouter.put("/update-book/:id", isLogin, isAdmin, bookController.updateBook);
bookRouter.delete("/delete-book/:id", isLogin, isAdmin, bookController.deleteBook);

//filter
bookRouter.get("/filter-book", bookController.filterBookByCategory);

//suggest
bookRouter.get("/suggest-book", isLogin, bookController.suggestBookForUser);

module.exports = bookRouter;


