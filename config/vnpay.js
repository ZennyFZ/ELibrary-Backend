require('dotenv').config();

module.exports = {
  vnpayConfig: {
    tmnCode: process.env.VNPAY_TMNCODE,
    secretKey: process.env.VNPAY_SECRET,
    vnpUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: process.env.ENVIROMENT == "development"? "http://localhost:5173/checkout" : "e-library-frontend-delta.vercel.app/checkout",
  },
};