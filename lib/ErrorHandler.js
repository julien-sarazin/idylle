module.exports = (req, res, error) => {
    if (!error)
        return res.status(500).send();

    const details = reason(error);
    console.error(details);

    if (error.code)
        return res.status(error.code).send(details);

    if (process.env.NODE_ENV !== 'production') {
        return res.status(500).send(details);
    }

    return res.status(500).send();
};

function reason(error) {
    return error.stack ? error.stack : error.reason ? error.reason : typeof error === 'object' ? JSON.stringify(error) : error.toString()
}
