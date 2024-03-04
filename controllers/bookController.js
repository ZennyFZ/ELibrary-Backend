const book = require('../models/book');
const category = require('../models/category');
const user = require('../models/user');
const mongoose = require('mongoose');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const storage = getStorage();

class bookController {

    getAllBooks(req, res, next) {
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

    getBookById(req, res, next) {
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

    getAllCategories(req, res, next) {
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
        book.find({ title: req.body.title, publishDate: req.body.publishDate }).then((books) => {
            if (books.length > 0) {
                res.status(400)
                res.json({
                    "error": "Book already exists"
                })
            } else {
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
                    category: req.body.category,
                    file: req.body.file
                })

                newBook.save().then((book) => {
                    res.status(200)
                    res.json({
                        book: book,
                        message: "Add book successfully"
                    })
                }).catch((err) => {
                    console.log(err);
                    res.status(500)
                    res.json({
                        "error": "Internal Server Error"
                    })
                })
            }
        })
    }

    async uploadBookImage(req, res, next) {
        try {
            const storageRef = ref(storage, `images/${req.file.originalname + "       " + Date.now()}`);

            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };

            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
            return res.json({
                message: 'image uploaded to firebase storage',
                name: req.file.originalname,
                type: req.file.mimetype,
                downloadURL: downloadURL
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json(error.message)
        }
    }

    async uploadBookFile(req, res, next) {
        try {
            const storageRef = ref(storage, `${req.file.originalname + "       " + Date.now()}`);

            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };

            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
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
                    return book.populate('category').execPopulate();
                }).then((book) => {
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
                book.deleteOne().then(() => {
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
        category.find({ name: { $regex: req.query.category } }).then((categoryId) => {
            if (categoryId && categoryId.length > 0) {
                book.find({ category: categoryId }).populate('category').then((books) => {
                    if (books) {
                        res.status(200)
                        res.json({
                            bookList: books
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                    res.status(500)
                    res.json({
                        "error": "Internal Server Error"
                    })
                })
            } else {
                res.status(404)
                res.json({
                    "error": "No Book in this category"
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500)
            res.json({
                "error": "Internal Server Error"
            })
        })
    }

    searchBookByName(req, res, next) {
        book.find({ title: { $regex: req.query.name, "$options": "i" } }).populate('category').then((books) => {
            if (books) {
                res.status(200)
                res.json({
                    bookList: books
                })
            } else {
                res.status(404)
                res.json({
                    "error": "No Book Found"
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500)
            res.json({
                "error": "Internal Server Error"
            })
        })
    }

    getBookFile(req, res, next) {
        book.findById(req.params.id).then((book) => {
            if (book) {
                res.status(200)
                res.json({
                    file: book.file
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

    async suggestBookForUser(req, res, next) {
        try {
            if (!req.body.id) {
                next(error)
            }

            //get bookList of user
            const bookList = await user.findById(req.body.id).then((user) => {
                return user.bookList;
            })

            if (bookList.length === 0) {
                res.status(200)
                res.json({
                    bookList: []
                })
            } else {
                //find most common category in bookList
                const categoryList = bookList.map(book => book.category);
                const categoryCount = {};
                categoryList.forEach(categoryId => {
                    categoryCount[categoryId] = categoryCount[categoryId] ? categoryCount[categoryId] + 1 : 1;
                });

                //compare 2 adjacent elements to find the most frequent element
                const mostCommonCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b);

                //get book list from most common category
                book.find({ category: mostCommonCategory }).then((books) => {
                    if (books) {
                        res.status(200)
                        res.json({
                            bookList: books
                        })
                    }
                })
            }

        } catch (error) {
            console.log(error);
            res.status(500)
            res.json({
                "error": "Internal Server Error"
            })
        }
    }

}

module.exports = new bookController();