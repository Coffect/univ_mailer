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
dotenv_1.default.config();
const app = (0, express_1.default)();
const router = express_1.default.Router();
const port = process.env.EC2_PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // JSON 본문을 파싱
app.use(express_1.default.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱
app.use((0, morgan_1.default)('dev')); // HTTP Req 요청 로그 출력
router.get('/', (req, res) => {
    res.json({ message: 'Health check' });
});
app.post('/univ/mail', async (req, res) => {
    const userEmail = req.body.userEmail;
    const univName = req.body.univName;
    const creaetd = new Date();
    const expired = new Date(Date.now() + 10 * 60 * 1000); // 현재 시간에서 10분 후의 시간
    const code = Math.floor(100000 + Math.random() * 900000); // 6자리 코드
    const q = process.env.SQL_UPDATECERT;
    try {
        await (0, mailer_1.send)(userEmail, code);
        db_config_1.default.query(q, [userEmail, code, creaetd, expired, true], (err, res) => {
            if (err)
                throw err;
            else
                return res;
        });
        return res.json({
            status: true,
            code: 200,
            msg: '메일전송성공'
        });
    }
    catch (err) {
        return res.json({
            status: false,
            code: 505,
            msg: err
        });
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
            if (certCode == db[0].certCode && db[0].valid && expiredDate > now) {
                return res.json({
                    status: true,
                    code: 200,
                    msg: '인증성공'
                });
            }
        }
        throw new Error();
    }
    catch (err) {
        return res.json({
            status: false,
            code: 505,
            msg: err
        });
    }
});
// 서버 실행
app.listen(port, () => {
    console.log(`Sever is running on port ${port}`);
});
