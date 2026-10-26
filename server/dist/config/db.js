"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testConnection = testConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aran_db',
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});
async function testConnection() {
    try {
        const connection = await exports.pool.getConnection();
        console.log('✅ Connected to MySQL Database:', process.env.DB_NAME || 'aran_db');
        connection.release();
        return true;
    }
    catch (err) {
        console.error('❌ MySQL Connection Failed:', err);
        return false;
    }
}
