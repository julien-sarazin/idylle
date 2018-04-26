class Context {
    constructor() {
        this.data = request.body;
        this.params = request.params;
        this.token = request.token;
        this.user = request.user;
        this.session = request.session;
        this.files = request.files;
    }
}