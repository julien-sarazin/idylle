bindErrors(ensureOne);
module.exports.one = ensureOne;

bindErrors(ensureNone);
module.exports.none = ensureNone;

class HTTPError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

function ensureOne(data) {
    if (data instanceof Array)
        return (data.length > 0) ? Promise.resolve(data) : Promise.reject();

    return (data) ? Promise.resolve(data) : Promise.reject();
}

function ensureNone(data) {
    if (data instanceof Array)
        return (data.length > 0) ? Promise.reject() : Promise.resolve(data);

    return (data) ? Promise.reject() : Promise.resolve(data);
}

function bindErrors(validator) {
    validator.else = {};
    const errors = {
        badRequest:
            400,
        notFound:
            404,
        conflict:
            409,
        forbidden:
            403,
        unauthorized:
            401,
        unprocessable:
            422
    };

    for (let key in errors)
        if (errors.hasOwnProperty(key))
            validator.else[key] = utilsError.bind(null, validator, errors[key]);

    function utilsError(validator, code, message) {
        return (input) => {
            return validator(input).catch(() => Promise.reject(new HTTPError(message, code)));
        }
    }
}