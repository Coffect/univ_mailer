"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
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
});
app.post('/univ/cert', async (req, res) => {
    const certCode = req.body.certCode;
});
// 서버 실행
app.listen(port, () => {
    console.log(`Sever is running on port ${port}`);
});
