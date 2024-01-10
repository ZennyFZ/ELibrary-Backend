const book = require('../models/book');
const category = require('../models/category');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage');
const storage = getStorage();

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

    async uploadBookImage(req, res, next) {
        try {
            const storageRef = ref(storage, `files/${req.file.originalname + "       " + Date.now()}`);
    
            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };
    
            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    
            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
    
            console.log('File successfully uploaded.');
            return res.json({
                message: 'file uploaded to firebase storage',
                name: req.file.originalname,
                type: req.file.mimetype,
                downloadURL: downloadURL
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json(error.message)
        }
    }

    updateBook(req, res, next) {
        res.send('Update Book');
    }

    deleteBook(req, res, next) {
        res.send('Delete Book');
    }

    filterBookByCategory(req, res, next) {
        book.find({ category: req.query.category }).populate('category').then((books) => {
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

    suggestBookForUser(req, res, next) {
        res.send('Suggest Book By User');
    }

}

module.exports = new bookController();