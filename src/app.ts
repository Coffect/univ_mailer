import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { send } from './config/mailer';
import pool from './config/db.config';
import { errorHandler, MailNotUniv, MailSendFail } from './config/error';
import { isUnivDomain } from './config/config';
import logger from './config/logger';

dotenv.config();
const app = express();
const router = express.Router();
const port = process.env.EC2_PORT || 3001;

app.use(cors());
app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱
app.use(logger); // HTTP Req 요청 로그 출력
app.use('/public', express.static('public')); // 정적 파일 서빙

// 에러 핸들러 미들웨어를 라우터 정의 전에 등록
app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ message: 'Health check' });
});

app.post('/univ/mail', async (req, res) => {
  const userEmail: string = req.body.userEmail;
  const now = new Date();
  const utc = new Date(now.toISOString());
  const creaetd = new Date(utc.getTime());
  const expired = new Date(utc.getTime() + 10 * 60 * 1000); // 현재 시간에서 10분 후의 시간

  const code = Math.floor(10000 + Math.random() * 90000);
  const q = process.env.SQL_UPDATECERT!;

  // const isUniv = isUnivDomain(userEmail);
  // if (!isUniv) {
  //   return res.status(401).json(new MailNotUniv('학교 도메인이 아닙니다.'));
  // }
  try {
    await send(userEmail, code);
    await new Promise((resolve, reject) => {
      pool.query(q, [userEmail, code, creaetd, expired, true], (err, res) => {
        if (err) return reject(err);
        else resolve(res);
      });
    });
    return res.json({
      success: true,
      statusCode: 200,
      code: null,
      description: '메일 전송 성공'
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.';
    return res.status(500).json(new MailSendFail(errorMessage));
  }
});

// 서버 실행
app.listen(3001, () => {
  console.log(`Sever is running on port ${port}`);
});
