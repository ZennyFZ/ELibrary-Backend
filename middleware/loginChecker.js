const jwt = require('jsonwebtoken');
const user = require('../models/user');

const isLogin = (req, res, next) => {
    if (req.headers['cookie'] == undefined) {
        res.status(401);
        res.json({
            message: 'Not logged in!'
        })
    } else {
        const token = req.headers['cookie'].split('=')[1];
        jwt.verify(token, 'elibrary1235');
        next();
    }
}

const isAdmin = (req, res, next) => {
    const token = req.headers['cookie'].split('=')[1];
    const decoded = jwt.verify(token, 'elibrary1235');
    user.find({ email: decoded.email }).then(info => {
        console.log(info);
        if (info[0].role != 'admin') {
            res.status(403);
            res.json({
                message: 'Not an admin!'
            })
        }else{
            next();
        }
    })
}

// const isPremium = (req, res, next) => {
//     const token = req.headers['cookie'].split('=')[1];
//     const decoded = jwt.verify(token, 'elibrary1235');
//     user.find({ email: decoded.email }).then(user => {
//         if (!user[0].isPremium) {
//             res.json({
//                 message: 'Not a premium user!'
//             })
//         }else{
//             next();
//         }
//     })
// }

module.exports = {
    isLogin,
    isAdmin
}