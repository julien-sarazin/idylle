class ContextError extends Error {
    constructor(message, code, ...args) {
        super(message);
        this.code = code || 500;
        this.message = message || "";
        this.args = args;
    }

    toJSON(options) {
        let error = {
            code: this.code,
            reason: this.message
        };

        if (options && options.stack)
            error.stack = this.stack;

        return error;
    }
}

module.exports = ContextError;
