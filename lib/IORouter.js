const Promise = require('bluebird');
const path = require('path');

class IORouter {
    constructor(socket, base) {
    if (!socket)
        throw new Error(); // Todo send better Error

        this.socket = socket;
        this.base = base;
    }

    on(route, ... functions) {
        const event = this.base
            ? path.join(this.base, route)
            : route;

        this.socket.on(event, data => {
            return Promise.each(functions, fn => fn(this.socket, data))
        });

        return this;
    }
}

module.exports = IORouter;