const { sendResponse } = require('../utils/responseHandler');

function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return sendResponse(res, 403, null, 'Access forbidden. User does not have the required role.');
        }
        next();
    };
}

module.exports = { authorize };
