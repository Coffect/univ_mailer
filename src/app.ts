import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { send } from './config/mailer';
import pool from './config/db.config';
import { QueryResult, RowDataPacket } from 'mysql2';

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
  const creaetd = new Date();
  const expired = new Date(Date.now() + 10 * 60 * 1000); // 현재 시간에서 10분 후의 시간

  const code = Math.floor(100000 + Math.random() * 900000); // 6자리 코드
  const q = process.env.SQL_UPDATECERT!;
  try {
    await send(userEmail, code);
    await new Promise((resolve, reject) => {
      pool.query(q, [userEmail, code, creaetd, expired, true], (err, res) => {
        if (err) return reject(err);
        else resolve(res);
      });
    });
    return res.json({
      status: true,
      code: 200,
      msg: '메일전송성공'
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      code: 500,
      msg: err
    });
  }
});

app.post('/univ/cert', async (req, res) => {
  const certCode = req.body.certCode;
  const userEmail = req.body.userEmail;

  try {
    const q = process.env.SQL_SELECTCERT!;
    const db = await new Promise((resolve, rejcet) => {
      pool.query(q, [userEmail], (err, res: QueryResult) => {
        if (err) rejcet(err);
        else resolve(res);
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
  } catch (err) {
    return res.status(500).json({
      status: false,
      code: 500,
      msg: err
    });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
