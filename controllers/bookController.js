class bookController {

    getAllBooks(req, res, next) {
        res.send('Get All Books');
    }

    getBookById(req, res, next) {
        res.send('Get Book By Id');
    }

    getAllCategories(req, res, next) {
        res.send('Get All Categories');
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