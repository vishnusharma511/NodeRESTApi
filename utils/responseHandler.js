const sendResponse = (res, status, data, message) => {
    res.status(status);
    if (data) {
        res.json({ data, message });
    } else {
        res.json({ message });
    }
};

module.exports = { sendResponse };
