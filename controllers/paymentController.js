const moment = require('moment');
const Stripe = require('stripe')
const config = require('../config/vnpay');
const uuid = require('uuid').v1;
const axios = require('axios');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const querystring = require('qs');

class paymentController {

    payment(req, res, next) { // Payment by VNPAY
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

        let signData = querystring.stringify(vnp_Params, { encode: false });
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

    checkPaymentForVNPay(req, res, next) {
        // var vnp_Params = req.query;

        // var secureHash = vnp_Params['vnp_SecureHash'];
    
        // delete vnp_Params['vnp_SecureHash'];
        // delete vnp_Params['vnp_SecureHashType'];
    
        // vnp_Params = sortObject(vnp_Params);
    
        // var config = require('config');
        // var tmnCode = config.get('vnp_TmnCode');
        // var secretKey = config.get('vnp_HashSecret');
    
        // var querystring = require('qs');
        // var signData = querystring.stringify(vnp_Params, { encode: false });
        // var crypto = require("crypto");     
        // var hmac = crypto.createHmac("sha512", secretKey);
        // var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    
        // if(secureHash === signed){
        //     //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    
        //     res.render('success', {code: vnp_Params['vnp_ResponseCode']})
        // } else{
        //     res.render('success', {code: '97'})
        // }
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

    paymentByMoMo(req, res, next) {
        let money = req.body.amount;
        let apiType = req.body.apiType;

        //Các tham số cần truyền vào URL
        var partnerCode = "MOMO";
        var accessKey = "F8BBA842ECF85";
        var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "Mua ebook từ E-Library";
        var redirectUrl = apiType === "Website" ? "https://e-library-frontend-delta.vercel.app/" : "localhost:5173";
        var ipnUrl = apiType === "Website" ? "https://e-library-frontend-delta.vercel.app/" : "localhost:5173";
        var amount = money;
        var requestType = "captureWallet"
        var extraData = "";


        //Tạo chữ ký cho giá trị signature trong body request của axios
        var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
        var signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');

        // dữ liệu cho body request của axios
        const requestBody = {
          partnerCode: partnerCode,
          accessKey: accessKey,
          requestId: requestId,
          amount: amount,
          orderId: orderId,
          orderInfo: orderInfo,
          redirectUrl: redirectUrl,
          ipnUrl: ipnUrl,
          extraData: extraData,
          requestType: requestType,
          signature: signature,
          lang: 'en'
        };

        // khai báo method, url, header và data cho axios
        const options = {
            method: 'post',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
              'Content-Type': 'application/json',
            },
            data: requestBody
        };
        
        // gửi request tới Momo để lấy link thanh toán
        axios(options).then(response => {
            res.status(200)
            res.json({
                data: response.data.payUrl
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({ message: 'Error sending Momo request' });
        });
        
    }

    checkPaymentForMomo(req, res, next) {

    }

    paymentByZaloPay(req, res, next) {
        const apiType = req.body.apiType;

        const config = {
            appid: "554",
            key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
            key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
        };

        const embeddata = {
            merchantinfo: "E-Library",
            redirecturl: apiType === "Website" ? "https://e-library-frontend-delta.vercel.app/" : "localhost:5173",
        };

        let order = {
            appid: config.appid, 
            apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // mã giao dich có định dạng yyMMdd_xxxx
            appuser: "demo", 
            apptime: Date.now(), // miliseconds
            item: "[]", 
            embeddata: JSON.stringify(embeddata), 
            amount: 50000, 
            description: "Thanh toán mua sách E-Library",
            bankcode: "zalopayapp", 
        };

        //các biến cho bankcode
        //Rỗng ("") (*): Danh sách tất cả các hình thức và ngân hàng được hỗ trợ (CC, ATM, zalopayapp, ...)
        //zalopayapp: Hiển thị QR code để thanh toán bằng ví ZaloPay/ Mở ứng dụng ZaloPay để thanh toán qua ví đối với mobile
        //CC: Form nhập thông tin Credit Card
        //Mã ngân hàng ATM (VTB, VCB, ...): Form nhập thông tin thẻ của ngân hàng tương ứng

        const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        axios.post(config.endpoint, null, { params: order }).then(response => {
            res.status(200)
            res.json({
                data: response.data
            })
        }).catch(err => console.log(err));
    }

    checkPaymentForZaloPay(req, res, next) {
        //https://docs.zalopay.vn/v1/general/overview.html#tao-don-hang_thong-tin-don-hang_tao-thong-tin-chung-thuc
        const config = {
            appid: "554",
            key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
            key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid"
        };
        const apptransid = req.body.apptransid;
        let data = `${config.appid}|${apptransid}|${config.key1}`;
        let mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        axios.post(config.endpoint, { appid: config.appid, apptransid, mac }).then(response => {
            res.status(200)
            res.json({
                data: response.data
            })
        }).catch(err => console.log(err));
    }

    paymentByVietQR(req, res, next) {
        const bankId = "MB"
        const accountNo = "0703809061"
        const template = "compact2"
        const amount = req.body.amount
        const description = uuid()
        const accountName = "Do Dinh Nhan"
        const payURL = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`
        res.status(200)
        res.json({
            data: payURL,
            transactionId: description
        })
    }

    async checkPaidForVietQR(req, res, next) {
        try {
            const response = await axios.get("https://script.google.com/macros/s/AKfycbzDRnoE2aeAAqSl3Y1wvT3t0n8PgPhcK4UZVWGsSHScX6zwJbCr_yGrlVaIh8V_LB0/exec")
            if (response.status === 200) {
                res.status(200)
                res.json({
                    data: response.data.data
                })
            }
        } catch (err) {
            res.status(500)
            res.json({
                message: "Internal server error"
            })
            console.log(err)
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