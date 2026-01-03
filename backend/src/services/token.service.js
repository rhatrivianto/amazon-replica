import jwt from 'jsonwebtoken';
export const verifyToken = (token, secret) => jwt.verify(token, secret);