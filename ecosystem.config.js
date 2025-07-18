import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  apps: [
    {
      name: 'univ-mailer',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        EMAIL_SERVICE: process.env.EMAIL_SERVICE,
        USER_ID: process.env.USER_ID,
        USER_PASSWORD: process.env.USER_PASSWORD,
        DATABASE_USERNAME: process.env.DATABASE_USERNAME,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_NAME: process.env.DATABASE_NAME,
        SQL_SELECTCERT: process.env.SQL_SELECTCERT,
        SQL_UPDATECERT: process.env.SQL_UPDATECERT
        // DATABASE_Endpoint: process.env.DATABASE_Endpoint
        // NODE_ENV: process.env.ENV,
        // ENV: process.env.ENV,
      }
    }
  ]
};
