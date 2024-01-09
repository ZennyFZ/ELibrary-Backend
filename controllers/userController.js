const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class userController {

    Login(req, res, next) {
        user.findOne({ email: req.body.email }).then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.status(500)
                        res.json({
                            message: "Something went wrong!"
                        })
                    } else {
                        if (result) {
                            let token = jwt.sign({ email: user.email }, 'elibrary1235')
                            res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
                            res.status(200)
                            res.json({
                                message: 'Login Successful!'
                            })
                        } else {
                            res.status(404)
                            res.json({
                                message: 'Password does not match!'
                            })
                        }
                    }
                })
            } else {
                res.status(404)
                res.json({
                    message: 'No user found!'
                })
            }
        })
    }

    Register(req, res, next) {
        user.find({ email: req.body.email }).then(userCheck => {
            if (userCheck.length >= 1) {
                res.status(500)
                res.json({
                    message: 'Email already exists!'
                })
            } else {
                bcrypt.hash(req.body.password, 8, (err, hash) => {
                    if (err) {
                        res.status(500)
                        res.json({
                            message: "Something went wrong!"
                        })
                    } else {
                        const newUser = new user({
                            name: "",
                            email: req.body.email,
                            password: hash,
                            dob: "",
                            phone: "",
                            role: "user",
                            isPremium: false,
                            premiumExpiry: "",
                            bookList: []
                        })
                        newUser.save().then(user => {
                            res.status(200)
                            res.json({
                                message: 'Register Successful!'
                            })
                        })
                    }
                })
            }
        })
    }

    getCurrentUser(req, res, next) {
        const token = req.headers['cookie'].split('=')[1];
        const decoded = jwt.verify(token, 'elibrary1235');
        if (!decoded) {
            res.status(404)
            res.json({
                message: 'User not found!'
            })
        }
        if (decoded.exp < Date.now() / 1000) {
            res.status(404)
            res.json({
                message: 'Token expired!'
            })
        }
        const email = decoded.email;
        user.findOne({ email }).then(user => {
            res.status(200)
            res.json({
                user
            })
        })
    }

    UpdateProfile(req, res, next) {
        res.send('Update Profile');
    }

    ChangePassword(req, res, next) {
        res.send('Change Password');
    }
}

module.exports = new userController();