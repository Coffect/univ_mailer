import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// const isLocal: boolean = process.env.ENV === 'local';

let connectionConfig: mysql.ConnectionOptions = {
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
};

connectionConfig = {
  //ssh 터널링 이후 진행
  ...connectionConfig,
  host: 'localhost',
  port: 3307
};

// if (isLocal) {
// } else {
//   connectionConfig = {
//     ...connectionConfig,
//     host: process.env.DATABASE_Endpoint,
//     port: 3306
//   };
// }

const pool = mysql.createConnection(connectionConfig);

export default pool;
