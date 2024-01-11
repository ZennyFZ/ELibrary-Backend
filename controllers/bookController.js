const book = require('../models/book');
const category = require('../models/category');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage');
const storage = getStorage();

class bookController {

    getAllBooks(req, res) {
        book.find({ isDeleted: false }).populate('category').then((books) => {
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
        console.log('get all categories');
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
        const newBook = new book({
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher,
            publishDate: req.body.publishDate,
            pages: req.body.pages,
            language: req.body.language,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description,
            isDeleted: false,
            category: req.body.category,
        })

        newBook.save().then((book) => {
            res.status(200)
            res.json({
                book: book,
                message: "Add book successfully"
            })
        }).catch((err) => {
            res.status(500)
            res.json({
                "error": "Internal Server Error"
            }) 
        })
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
        book.findById(req.params.id).then((book) => {
            if (book) {
                book.title = req.body.title ? req.body.title : book.title;
                book.author = req.body.author ? req.body.author : book.author;
                book.publisher = req.body.publisher ? req.body.publisher : book.publisher;
                book.publishDate = req.body.publishDate ? req.body.publishDate : book.publishDate;
                book.pages = req.body.pages ? req.body.pages : book.pages;
                book.language = req.body.language ? req.body.language : book.language;
                book.price = req.body.price ? req.body.price : book.price;
                book.image = req.body.image ? req.body.image : book.image;
                book.description = req.body.description ? req.body.description : book.description;
                book.category = req.body.category ? req.body.category : book.category;

                book.save().then((book) => {
                    res.status(200)
                    res.json({
                        book: book,
                        message: "Update book successfully"
                    })
                }).catch((err) => {
                    res.status(500)
                    res.json({
                        "error": "Internal Server Error"
                    })
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

    deleteBook(req, res, next) {
        book.findById(req.params.id).then((book) => {
            if (book) {
                book.isDeleted = true;
                book.save().then((book) => {
                    res.status(200)
                    res.json({
                        message: "Delete book successfully"
                    })
                }).catch((err) => {
                    res.status(500)
                    res.json({
                        "error": "Internal Server Error"
                    })
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
        res.send('Suggest Book For User');
    }

}

module.exports = new bookController();