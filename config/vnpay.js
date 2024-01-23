require('dotenv').config();

module.exports = {
  vnpayConfig: {
    tmnCode: process.env.VNPAY_TMNCODE,
    secretKey: process.env.VNPAY_SECRET,
    vnpUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: process.env.ENVIROMENT == "development"? "localhost:5173" : "e-library-frontend-delta.vercel.app",
  },
};