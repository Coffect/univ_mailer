import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { EMAIL_SERVICE, USER_ID, USER_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: USER_ID,
    pass: 'USER_PASSWORD'
  }
});

// async () => await send();
export async function send(dest: string, code: number) {
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
        if (err) reject(err);
        else resolve(info);
      });
    });
    return result;
  } catch (error) {
    throw error;
  }
}
