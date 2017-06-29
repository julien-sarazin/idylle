const ActionError = require('./ActionError');

module.exports = (req, res, error) => {
    const production = (process.env.NODE_ENV === 'production')

    if (!error)
        return res.status(500).send();

    console.error((error.stack ? error.stack : error));

    if (error instanceof ActionError)
        return res.status(error.code).send(error.toJSON({stack: !production}));

    return res.status(500).send({error: error});
};