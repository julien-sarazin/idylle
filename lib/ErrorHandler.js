module.exports = (error, req, res, next) => {
    const reason = reason(error);

    if (error.code && error.code >= 300 && error.code <= 500)
        return res.status(error.code).send(reason);

    if (process.env.NODE_ENV !== 'production') {
        return res.status(500).send(error);
    }

    return res.status(500).send();
};

function reason(error) {
    return error.stack ? error.stack : error.reason ? error.reason : typeof error === 'object' ? JSON.stringify(error) : error.toString()
}
