const book = require("../models/book");
const category = require("../models/category");
class categoryController {

    addCategory(req, res, next) {
        const categoryName = req.body.name;
        if (categoryName.trim().length === 0) {
            res.status(400)
            res.json({
                message: "Category name is required!"
            })
        }else{
            category.findOne({ name: { $regex: req.body.name, "$options": "i" } }).then(result => {
                let check =  result?.name.toLocaleLowerCase() === req.body.name.toLocaleLowerCase() 
                if (result && check) {
                    res.status(400)
                    res.json({
                        message: "Category already exist!"
                    })
                } else {
                    const newCategory = new category({
                        name: req.body.name
                    })
                    newCategory.save().then(result => {
                        res.status(200)
                        res.json({
                            message: result._id
                        })
                    })
                }
            }).catch(err => {
                res.status(500)
                res.json({
                    message: "Internal Server Error!"
                })
            })
        }
    }

    getAllCategories(req, res, next) {
        category.find().then(categories => {
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
        const categoryName = req.body.name;
        if (categoryName.trim().length === 0) {
            res.status(400)
            res.json({
                message: "Category name is required!"
            })
        }else{
            category.findOne({ name: { $regex: req.body.name, "$options": "i" } }).then(result => {
                let check =  result?.name.toLocaleLowerCase() === req.body.name.toLocaleLowerCase() 
                if (result && check) {
                    res.status(400)
                    res.json({
                        message: "Category already exist!"
                    })
                } else {
                    category.updateOne({ _id: req.body.id }, {
                        name: req.body.name
                    }).then(result => {
                        res.status(200)
                        res.json({
                            message: "Category updated successfully!"
                        })
                    })
                }
            }).catch(err => {
                res.status(500)
                res.json({
                    message: "Internal Server Error!"
                })
            })
        }
    }

    deleteCategory(req, res, next) {
        book.findOne({ category: req.params.id }).then((book) => {
            if (book) {
                res.status(400);
                res.json({
                  message: "Can not delete category in use!",
                });
                return
            }
          category
            .deleteOne({ _id: req.params.id })
            .then((result) => {
              res.status(200);
              res.json({
                message: "Category deleted successfully!",
              });
            })
            .catch((err) => {
              res.status(500);
              res.json({
                message: "Internal Server Error!",
              });
            });
        });
        return;
      }

}

module.exports = new categoryController();