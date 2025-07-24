const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apps: [
    {
      name: 'ssh-tunnel',
      scrpit: 'ssh',
      args: "-L 3307:coffect-database.ctiiy4oiaiau.ap-northeast-2.rds.amazonaws.com:3306 -N -f -i '~/.ssh/coffect-keypair.pem' ubuntu@3.34.146.212",
      autorestart: true,
      watch: false
    },
    {
      name: 'univ-mailer',
      script: './dist/app.js',
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
      }
    }
  ]
};
