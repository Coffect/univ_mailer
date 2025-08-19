import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const { EMAIL_SERVICE, USER_ID, USER_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  // secure: true,
  auth: {
    user: USER_ID,
    pass: USER_PASSWORD
  }
});

// 이미지를 Base64로 인코딩하는 함수
const getImageAsBase64 = () => {
  try {
    const imagePath = path.join(__dirname, '../../public/coffect.png');
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('이미지 파일을 읽을 수 없습니다:', error);
    return null;
  }
};

const html = (code: number) => {
  const imageBase64 = getImageAsBase64();
  const imageSrc = imageBase64 ? `data:image/png;base64,${imageBase64}` : '';

  return `
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <!-- 일부 클라이언트에 색상 스킴 힌트 -->
  <meta name="color-scheme" content="light dark">
  <style>
    /* 모바일 친화 폰트 사이즈 조정 */
    @media only screen and (max-width:600px){
      .container { width: 100% !important; padding: 16px !important; }
      .code { font-size: 28px !important; letter-spacing: 6px !important; }
    }
    /* 다크모드 지원 (지원되는 클라이언트에서만 적용) */
    @media (prefers-color-scheme: dark){
      body, .wrapper { background:#111111 !important; }
      .card { background:#1b1b1b !important; border-color:#2a2a2a !important; }
      .text, .muted { color:#e9e9e9 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;">
  <!-- 프리헤더 (받은편지함 미리보기용) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    커펙트 인증코드: ${code}
  </div>

  <table role="presentation" width="100%" class="wrapper" style="background:#f5f7fb;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="560" class="container" style="width:560px;background:transparent;border-collapse:collapse;">
          <tr>
            <td style="padding:0 0 16px 0;text-align:center;">
              ${
                imageBase64
                  ? `<img src="${imageSrc}" width="40" height="40" style="display:inline-block;border:0;" alt="Coffect">`
                  : ''
              }
            </td>
          </tr>

          <tr>
            <td class="card" style="background:#ffffff;border:1px solid #e6e9ef;border-radius:12px;padding:28px;">
              <h1 class="text" style="margin:0 0 12px 0;font-size:20px;line-height:1.4;color:#111827;">
                Coffect 대학 인증
              </h1>
              <p class="text" style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#374151;">
                아래 6자리 코드를 10분 이내에 입력해 주세요.
              </p>

              <div class="code" style="font-family:ui-monospace, SFMono-Regular, Menlo, monospace;
                   font-size:32px; letter-spacing:8px; text-align:center; color:#111827;
                   background:#f3f4f6; border-radius:10px; padding:16px 12px; margin:12px 0;">
                ${code}
              </div>

              <p class="muted" style="margin:14px 0 0 0;font-size:12px;color:#6b7280;">
                이 메일은 발신 전용이며 회신이 수신되지 않습니다.
              </p>
            </td>
          </tr>

          <tr>
            <td style="text-align:center;padding:16px 0 0 0;">
              <p class="muted" style="margin:0;font-size:12px;color:#9ca3af;">
                © Coffect · 인증 관련 문의는 앱 내 고객센터를 이용해 주세요.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// async () => await send();
export async function send(dest: string, code: number) {
  const mailOptions = {
    from: USER_ID,
    to: dest,
    subject: 'Coffect 대학 인증 메일',
    html: html(code)
  };

  try {
    const result = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) reject(err);
        else resolve(info);
      });
    });
    return result;
  } catch (error) {
    throw error;
  }
}
