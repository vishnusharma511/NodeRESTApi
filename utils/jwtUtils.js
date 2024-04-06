const jwt = require('jsonwebtoken');
const config = require('../config/config');

const JWT_SECRET = config.get('jwt_secret');

function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

function getTokenExpiration(decodedToken) {
    if (!decodedToken || !decodedToken.exp) {
        throw new Error('Invalid token');
    }
    return decodedToken.exp * 1000;
}


module.exports = { generateToken, verifyToken, getTokenExpiration };
