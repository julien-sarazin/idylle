const Promise = require('bluebird');
const path = require('path');

class IORouter {
    constructor(socket, base) {
        if (!socket)
            throw new Error(); // Todo send better Error

        this.socket = socket;
        this.base = base;
    }

    on(route, ...functions) {
        const event = this.base
            ? path.join(this.base, route)
            : route;

        this.socket.on(event, (data, cb) => {
            cb = cb || (() => {});

            return Promise
                .mapSeries(functions, fn => fn(this.socket, data))
                .then(_.last)
                .then(cb)
                .catch(error => cb({ error }))
        });

        return this;
    }
}

module.exports = IORouter;
