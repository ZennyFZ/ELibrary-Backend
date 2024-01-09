const axios = require('axios');
const getSirvToken = (req,res,next) => {
    axios({
        method: 'post',
        url: 'https://api.sirv.com/v2/token',
        data: {
            "clientId": process.env.SIRV_CLIENT_KEY,
            "clientSecret": process.env.SIRV_SECRET_KEY
        },
        headers: {
            'content-type': 'application/json'
        }
    }).then((response) => {
        req.token = response.data.token;
        console.log(req.token);
        next();
    }).catch((err) => {
        console.log(err);
    })
}

const uploadImageToSirv = (req,res,next) => {
    axios({
        method: 'post',
        url: `https://api.sirv.com/v2/files/upload?filename=${req.file.filename}`,
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${req.token}`
        }
    }).then((response) => {
        console.log(response);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = {
    getSirvToken,
    uploadImageToSirv
}