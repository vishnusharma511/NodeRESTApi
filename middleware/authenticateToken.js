const { verifyToken, getTokenExpiration } = require("../utils/jwtUtils");
const { sendResponse } = require("../utils/responseHandler");

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    sendResponse(res, 401, null, "Authorization token not provided");
    return;
  }

  try {
    const decodedToken = verifyToken(token);
    const tokenExp = getTokenExpiration(decodedToken);

    if (Date.now() >= tokenExp) {
      sendResponse(res, 401, null, "Token has expired");
      return;
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    sendResponse(res, 403, null, "Invalid token");
  }
}

module.exports = { authenticateToken };
