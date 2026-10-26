"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'Access denied. No authorization token provided.' });
        return;
    }
    const secret = process.env.JWT_SECRET || 'aran_default_secret_fallback_key';
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(403).json({ success: false, message: 'Invalid or expired token.' });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateToken = authenticateToken;
