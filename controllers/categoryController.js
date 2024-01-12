const category = require("../models/category");

class categoryController {

    addCategory(req, res, next) {
        const newCategory = new category({
            name: req.body.name,
            isDeleted: false
        })
        newCategory.save().then(result => {
            res.status(201)
            res.json({
                message: "Category added successfully!"
            })
        }).catch(err => {
            res.status(500)
            res.json({
                message: "Internal Server Error!"
            })
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