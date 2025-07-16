import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { send } from './config/mailer';
import pool from './config/db.config';
import { QueryResult, RowDataPacket } from 'mysql2';
import {
  CertCodeExpired,
  CertCodeInvaild,
  CertCodeNotMatch,
  errorHandler,
  MailSendFail
} from './config/error';

dotenv.config();
const app = express();
const router = express.Router();
const port = process.env.EC2_PORT || 3000;

app.use(cors());
app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱
app.use(morgan('dev')); // HTTP Req 요청 로그 출력

// 에러 핸들러 미들웨어를 라우터 정의 전에 등록
app.use(errorHandler);

// router.get('/', (req, res) => {
//   res.json({ message: 'Health check' });
// });

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
      success: true,
      statusCode: 200,
      code: null,
      description: '메일 전송 성공'
    });
  } catch (err) {
    // description을 문자열로 전달
    const errorMessage =
      err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.';
    return res.status(500).json(new MailSendFail(errorMessage));
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
      if (certCode != db[0].certCode) {
        return res
          .status(400)
          .json(new CertCodeNotMatch('인증코드가 일치하지 않습니다.'));
      } else if (!db[0].valid) {
        return res
          .status(400)
          .json(new CertCodeInvaild('인증코드가 유효하지 않습니다.'));
      } else if (expiredDate < now) {
        return res
          .status(400)
          .json(new CertCodeExpired('인증코드가 만료되었습니다,'));
      }
      return res.json({
        success: true,
        statusCode: 200,
        code: null,
        description: '인증성공'
      });
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.';
    return res.status(500).json(new MailSendFail(errorMessage));
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
