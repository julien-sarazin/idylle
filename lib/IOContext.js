


class IOContext {
    constructor(socket, packet, criteriaBuilder) {
        this.socket = socket;

        this.criteria = criteriaBuilder.build(packet.query);

        this.data = packet.body;
        this.token = packet.token;

        this.user = socket.user;
    }
}

module.exports = IOContext;