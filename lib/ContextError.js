class ContextError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code || 500;
        this.message = message || ""
    }

    toJSON(options) {
        let error = {
            reason: this.message
        };

        if (options && options.stack)
            error.stack = this.stack;

        return error;
    }
}

module.exports = ContextError;