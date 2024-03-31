const generateErrorMessage = (errors) => {
    const errorMessages = {};
    errors.forEach(error => {
        errorMessages[error.path] = error.message;
    });
    return errorMessages;
};

const handleServerError = (res, err) => {
    console.error(err);
    if (res.headersSent) {
        return res.end();
    }
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Invalid ObjectId' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
};


const handleNotFoundError = (res, data, message) => {
    if (!data) {
        return res.status(404).json({ message: message });
    }
};

module.exports = { generateErrorMessage, handleServerError, handleNotFoundError };
