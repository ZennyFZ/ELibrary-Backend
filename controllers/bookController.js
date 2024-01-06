const book = require('../models/book');
const category = require('../models/category');

class bookController {

    getAllBooks(req, res) {
        book.find({}).populate('category').then((books) => {
            if (books) {
                res.status(200)
                res.json({
                    bookList: books
                })
            }
        }).catch((err) => {
            res.status(500)
            res.json({
                "error": "Internal Server Error"
            })
        })
    }

    getBookById(req, res) {
        book.findById(req.params.id).populate('category').then((book) => {
            if (book) {
                res.status(200)
                res.json({
                    book: book
                })
            } else {
                res.status(404)
                res.json({
                    "error": "Book Not Found"
                })
            }
        }).catch((err) => {
            res.status(500)
            res.json({
                "error": "Internal Server Error"
            })
        })
    }

    getAllCategories(req, res) {
        category.find({}).then((categories) => {
            if (categories) {
                res.status(200)
                res.json({
                    categoryList: categories
                })
            }
        }).catch((err) => {
            res.status(500)
            res.json({
                "error": "Internal Server Error"
            })
        })
    }

    addBook(req, res, next) {
        res.send('Add Book');
    }

    updateBook(req, res, next) {
        res.send('Update Book');
    }

    deleteBook(req, res, next) {
        res.send('Delete Book');
    }

    filterBookByCiteria(req, res, next) {
        res.send('Filter Book By Criteria');
    }

    suggestBookForUser(req, res, next) {
        res.send('Suggest Book By User');
    }

}

module.exports = new bookController();