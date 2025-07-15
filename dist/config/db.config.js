"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isLocal = process.env.ENV === 'local';
let connectionConfig = {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
};
if (isLocal) {
    connectionConfig = {
        ...connectionConfig,
        host: 'localhost',
        port: 3307
    };
}
else {
    connectionConfig = {
        ...connectionConfig,
        host: process.env.DATABASE_Endpoint,
        port: 3306
    };
}
const pool = mysql2_1.default.createConnection(connectionConfig);
exports.default = pool;
