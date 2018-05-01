class IORouter {
    constructor(socket) {
        this.socket = socket;
    }

    on(route, ... functions) {
        this.socket.on(route, data => {
            return Promise.each(functions, fn => fn(socket, data))
        })
    }
}

module.exports = IORouter;