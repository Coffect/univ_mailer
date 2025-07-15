"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = send;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { EMAIL_SERVICE, USER_ID, USER_PASSWORD } = process.env;
const transporter = nodemailer_1.default.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: USER_ID,
        pass: USER_PASSWORD
    }
});
// async () => await send();
async function send(dest, code) {
    const mailOptions = {
        from: USER_ID,
        to: dest,
        subject: 'Coffect 대학 인증 메일',
        html: `
        <body>
          coffect 학교 인증을 위해 코드를 입력해주세요
          ${code}
        </body>
      `
    };
    try {
        const result = await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err)
                    reject(err);
                else
                    resolve(info);
            });
        });
        return result;
    }
    catch (error) {
        return error;
    }
}
