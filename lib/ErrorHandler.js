const ContextError = require('./ContextError');

module.exports = (req, res, error) => {
    res.header('content-type', 'application/json');

    if (!error)
        return res.status(500).send();

    console.error((error.stack ? error.stack : error));

    let code = (error.code && error.code >= 200 && error.code <= 503 ) ? error.code : 500;
    return res
        .status(code)
        .send({reason: error.reason || error.message || error});
};