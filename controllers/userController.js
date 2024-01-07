const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class userController {

    Login(req, res, next) {
        //chưa giải quyết được nếu password được mã hóa gửi tới server (lười thêm)
        user.findOne({ email: req.body.email }).then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ email: user.email }, 'elibrary1235')
                        res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
                        res.json({
                            message: 'Login Successful!'
                        })
                    } else {
                        res.json({
                            message: 'Password does not match!'
                        })
                    }
                })
            } else {
                res.json({
                    message: 'No user found!'
                })
            }
        })
    }

    Register(req, res, next) {
        
    }

    getCurrentUser(req, res, next) {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, 'elibrary1235');
        if (!decoded) {
            res.json({
                message: 'User not found!'
            })
        }
        if (decoded.exp < Date.now() / 1000) {
            res.json({
                message: 'Token expired!'
            })
        }
        const email = decoded.email;
        user.findOne({ email }).then(user => {
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