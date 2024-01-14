const category = require("../models/category");
const book = require("../models/book");
const { ObjectId } = require('mongodb')

class categoryController {

    addCategory(req, res, next) {
        category.findOne({ name: { $regex: req.body.name, $options: "i" } }).then(result => {
            if (result) {
                if (result.isDeleted) {
                    category.updateOne({ _id: result._id }, {
                        isDeleted: false
                    }).then(() => {
                        res.status(200)
                        res.json({
                            message: result._id
                        })
                    })
                } else {
                    res.status(400)
                    res.json({
                        message: "Category already exist!"
                    })
                }
            } else {
                const newCategory = new category({
                    name: req.body.name,
                    isDeleted: false
                })
                newCategory.save().then(result => {
                    res.status(200)
                    res.json({
                        message: result._id
                    })
                }).catch(err => {
                    res.status(500)
                    res.json({
                        message: "Internal Server Error!"
                    })
                })
            }
        })
    }

    getAllCategories(req, res, next) {
        category.find({ isDeleted: false }).then(categories => {
            res.status(200)
            res.json({
                categories
            })
        }).catch(err => {
            res.status(500)
            res.json({
                message: "Internal Server Error!"
            })
        })
    }

    getCategoryById(req, res, next) {
        category.findById(req.params.id).then(category => {
            res.status(200)
            res.json({
                category
            })
        }).catch(err => {
            res.status(500)
            res.json({
                message: "Internal Server Error!"
            })
        })
    }

    updateCategory(req, res, next) {
        let tempName = ""
        category.findOne({ name: { $regex: req.body.name, $options: "i" } }).then(result => {
            if (result) {
                if (result.isDeleted) {
                    category.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name }).then(categoryData => {
                        tempName = categoryData.name
                        category.updateOne({ _id: result._id }, { name: tempName }).then(() => {
                            book.updateMany({ category: new ObjectId(result._id) }, { category: new ObjectId(req.body.id) }).then(() => {
                                res.status(200)
                                res.json({
                                    message: "Category updated successfully!"
                                })
                            })
                        })
                    })
                } else {
                    res.status(400)
                    res.json({
                        message: "Category already exist!"
                    })
                }
            } else {
                category.updateOne({ _id: req.body.id }, {
                    name: req.body.name
                }).then(result => {
                    res.status(200)
                    res.json({
                        message: "Category updated successfully!"
                    })
                }).catch(err => {
                    res.status(500)
                    res.json({
                        message: "Internal Server Error!"
                    })
                })
            }
        })
    }

    deleteCategory(req, res, next) {
        category.updateOne({ _id: req.body.id }, {
            isDeleted: true
        }).then(result => {
            res.status(200)
            res.json({
                message: "Category deleted successfully!"
            })
        }).catch(err => {
            res.status(500)
            res.json({
                message: "Internal Server Error!"
            })
        })
    }

}

module.exports = new categoryController();