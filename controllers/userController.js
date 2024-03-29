const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const log = require('../models/log');

class userController {

    Login(req, res, next) {
        let userAgent = req.headers["user-agent"]
        let parser = new UAParser(userAgent)
        let deviceType = parser.getDevice().type
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
                            if(deviceType === 'mobile') {
                                res.status = 200
                                res.json({
                                    token,
                                    userId: user._id,
                                    role: user.role
                                })
                            }else{
                                res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true , sameSite: 'none' });
                                res.status(200)
                                res.json({
                                    message: 'Login Successful!'
                                })
                            }
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

    logout(req, res, next) {
        res.clearCookie('jwt');
        res.status(200)
        res.json({
            message: 'Logout Successful!'
        })
    }

    getCurrentUser(req, res, next) {
        const token = req.headers['cookie'].split('=')[1];
        const decoded = jwt.verify(token, 'elibrary1235');
        user.findOne({ email: decoded.email }).then(user => {
            user.password = undefined;
            res.status(200)
            res.json({
                user
            })
        })
    }

    UpdateProfile(req, res, next) {
        const token = req.headers['cookie'].split('=')[1];
        const decoded = jwt.verify(token, 'elibrary1235');
        user.findOne({ email: decoded.email }).then(user => {
            if (user) {
                user.name = req.body.name? req.body.name : user.name;
                user.email = req.body.email? req.body.email : user.email;
                user.dob = req.body.dob? req.body.dob : user.dob;
                user.phone = req.body.phone? req.body.phone : user.phone;
                user.save().then(user => {
                    res.status(200)
                    res.json({
                        message: 'Update profile successful!'
                    })
                })
            } else {
                res.status(404)
                res.json({
                    message: 'User not found!'
                })
            }
        })
    }

    ChangePassword(req, res, next) {
        const token = req.headers['cookie'].split('=')[1];
        const decoded = jwt.verify(token, 'elibrary1235');
        user.findOne({ email: decoded.email }).then(user => {
            if (user) {
                bcrypt.compare(req.body.oldPassword, user.password, (err, result) => {
                    if (err) {
                        res.status(500)
                        res.json({
                            message: "Internal Server Error!"
                        })
                    } else {
                        if (result) {
                            bcrypt.hash(req.body.newPassword, 8, (err, hash) => {
                                if (err) {
                                    res.status(500)
                                    res.json({
                                        message: "Internal Server Error!"
                                    })
                                } else {
                                    user.password = hash;
                                    user.save().then(user => {
                                        res.status(200)
                                        res.json({
                                            message: 'Change password successful!'
                                        })
                                    })
                                }
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
                    message: 'User not found!'
                })
            }
        })
    }

    getBooksByUserId(req, res, next) {
        user.findOne({ _id: req.params.id }).then(user => {
            if (user) {
                res.status(200)
                res.json({
                    bookList: user.bookList
                })
            } else {
                res.status(404)
                res.json({
                    message: 'User not found!'
                })
            }
        })
    }

    isExistInBookList(req, res, next) {
        user.findOne({ _id: req.params.id }).then(user => {
            if (user) {
                let isExist = false;
                user.bookList.forEach(book => {
                    if (book._id == req.body.bookId) {
                        isExist = true;
                    }
                })
                res.status(200)
                res.json({
                    isExist
                })
            } else {
                res.status(404)
                res.json({
                    message: 'User not found!'
                })
            }
        })
    }

    updateUserRole(req, res, next) {
        user.findOne({ _id: req.body.id }).then(user => {
            if (user) {
                user.role = req.body.role;
                user.save().then(user => {
                    res.status(200)
                    res.json({
                        message: 'Update role successful!'
                    })
                })
            } else {
                res.status(404)
                res.json({
                    message: 'User not found!'
                })
            }
        })
    }

    getAllUsers(req, res, next) {
        user.find().then(users => {
            res.status(200)
            res.json({
                users
            })
        })
    }

    writeLog(req, res, next) {
        log.create({ data: req.body.log }).then(log => {
            res.status(200)
            res.json({
                message: 'Write log successful!',
                logId: log._id
            })
        }).catch(err => {
            writeLog(req, res, next);
        })
    }
}

module.exports = new userController();