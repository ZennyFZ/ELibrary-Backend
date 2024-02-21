const moment = require('moment');
const Stripe = require('stripe')
const config = require('../config/vnpay');

class paymentController {

    payment(req, res, next) {
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = config.vnpayConfig.tmnCode;
        let secretKey = config.vnpayConfig.secretKey;
        let vnpUrl = config.vnpayConfig.vnpUrl;
        let returnUrl = config.vnpayConfig.returnUrl;
        let orderId = moment(date).format('DDHHmmss');
        let amount = req.body.amount;
        if (amount < 5000 || amount > 1000000000) {
            res.status(500)
            res.json({
                message: "Minimum amount is 5000 VND and maximum amount is 1000000000 VND"
            })
        }
        let bankCode = '';
        if (req.body.methodType === 'Bank') {
            bankCode = 'VNBANK';
        }
        if (req.body.methodType === 'ICard') {
            bankCode = 'INTCARD';
        }
        let locale = 'vn';
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        if (vnpUrl) {
            res.status(200)
            res.json({
                vnpUrl
            })
        } else {
            res.status(500)
            res.json({
                message: "Internal server error"
            })
        }
    }

    async paymentByGooglePay(req, res, next) {
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'vnd',
            payment_method_types: ['card'],
        });

        const clientSecret = paymentIntent.client_secret;
        if (clientSecret) {
            res.status(200)
            res.json({
                clientSecret
            })
        } else {
            res.status(500)
            res.json({
                message: "Internal server error"
            })
        }
    }
}

sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = new paymentController();