import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { send } from './config/mailer';
import pool from './config/db.config';

dotenv.config();
const app = express();
const router = express.Router();
const port = process.env.EC2_PORT || 3000;

app.use(cors());
app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱
app.use(morgan('dev')); // HTTP Req 요청 로그 출력

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
