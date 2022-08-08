"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendMail_lib_1 = require("../libs/notify/sendMail.lib");
async function testSendMail() {
    try {
        const dataSend = {
            from: '👻 Đông',
            to: ['trungdongfym1@gmail.com', 'nguyenducanh.ldb@gmail.com'],
            subject: 'Kakaka',
            text: 'abcxyz?',
        };
        const info = await (0, sendMail_lib_1.sendMail)(dataSend);
        return info;
    }
    catch (error) {
        console.log(error);
    }
}
exports.default = testSendMail;
