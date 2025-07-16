"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mailer_1 = require("./config/mailer");
const db_config_1 = __importDefault(require("./config/db.config"));
const error_1 = require("./config/error");
dotenv_1.default.config();
const app = (0, express_1.default)();
const router = express_1.default.Router();
const port = process.env.EC2_PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // JSON 본문을 파싱
app.use(express_1.default.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱
app.use((0, morgan_1.default)('dev')); // HTTP Req 요청 로그 출력
// 에러 핸들러 미들웨어를 라우터 정의 전에 등록
app.use(error_1.errorHandler);
// router.get('/', (req, res) => {
//   res.json({ message: 'Health check' });
// });
app.post('/univ/mail', async (req, res) => {
    const userEmail = req.body.userEmail;
    const univName = req.body.univName;
    const creaetd = new Date();
    const expired = new Date(Date.now() + 10 * 60 * 1000); // 현재 시간에서 10분 후의 시간
    const code = Math.floor(100000 + Math.random() * 900000); // 6자리 코드
    const q = process.env.SQL_UPDATECERT;
    try {
        await (0, mailer_1.send)(userEmail, code);
        await new Promise((resolve, reject) => {
            db_config_1.default.query(q, [userEmail, code, creaetd, expired, true], (err, res) => {
                if (err)
                    return reject(err);
                else
                    resolve(res);
            });
        });
        return res.json({
            success: true,
            statusCode: 200,
            code: null,
            description: '메일 전송 성공'
        });
    }
    catch (err) {
        // description을 문자열로 전달
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.';
        return res.status(500).json(new error_1.MailSendFail(errorMessage));
    }
});
app.post('/univ/cert', async (req, res) => {
    const certCode = req.body.certCode;
    const userEmail = req.body.userEmail;
    try {
        const q = process.env.SQL_SELECTCERT;
        const db = await new Promise((resolve, rejcet) => {
            db_config_1.default.query(q, [userEmail], (err, res) => {
                if (err)
                    rejcet(err);
                else
                    resolve(res);
            });
        });
        if (Array.isArray(db)) {
            const expiredAt = db[0].expiredAt; // 예: "2025-07-15T11:39:01.000Z"
            const expiredDate = new Date(expiredAt);
            const now = new Date();
            if (certCode != db[0].certCode) {
                return res
                    .status(400)
                    .json(new error_1.CertCodeNotMatch('인증코드가 일치하지 않습니다.'));
            }
            else if (!db[0].valid) {
                return res
                    .status(400)
                    .json(new error_1.CertCodeInvaild('인증코드가 유효하지 않습니다.'));
            }
            else if (expiredDate < now) {
                return res
                    .status(400)
                    .json(new error_1.CertCodeExpired('인증코드가 만료되었습니다,'));
            }
            return res.json({
                success: true,
                statusCode: 200,
                code: null,
                description: '인증성공'
            });
        }
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.';
        return res.status(500).json(new error_1.MailSendFail(errorMessage));
    }
});
// 서버 실행
app.listen(port, () => {
    console.log(`Sever is running on port ${port}`);
});
