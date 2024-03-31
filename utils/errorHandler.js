const generateErrorMessage = (errors) => {
    const errorMessages = {};
    errors.forEach(error => {
        errorMessages[error.path] = error.message;
    });
    return errorMessages;
};

module.exports = { generateErrorMessage };
