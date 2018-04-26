const ContextError = require('./ContextError');

class HTTP {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    setHeaders(dict) {
        for (let header in dict)
            if (dict.hasOwnProperty(header))
                this.response.header(header, dict[header]);
    }

    static get STATUSES() {
        return {
            ok: 'ok',
            created: 'created',
            partial: 'partial',
            noContent: 'noContent',
            redirect: 'redirect',
            stream: 'stream'
        }
    }
}

class HTTPContext {
    constructor(request, response, criteriaBuilder) {
        this.HTTP = (!request || !response) ? null : new HTTP(request, response);

        this.meta = { HTTP: { statusCode: 200, status: 'ok', headers: {} } };
        this.criteria = criteriaBuilder.build(request.query);

        this.ok = ok.bind(this);
        this.created = created.bind(this);
        this.partial = partial.bind(this);
        this.noContent = noContent.bind(this);
        this.redirect = redirect.bind(this);
        this.stream = stream.bind(this);
        this.error = error.bind(this);

        if (!this.HTTP)
            return;

        this.data = request.body;
        this.params = request.params;
        this.token = request.token;
        this.user = request.user;
        this.session = request.session;
        this.files = request.files;
    }
}


function ok(resource) {
    this.meta.HTTP.status = HTTPContext.STATUSES.ok;
    this.meta.HTTP.statusCode = 200;

    return resource;
}

function created(resource) {
    this.meta.HTTP.status = HTTPContext.STATUSES.created;
    this.meta.HTTP.statusCode = 201;

    if (resource && resource.uri)
        this.meta.HTTP.headers.location = resource.uri;

    return resource;
}

function partial(resource) {
    this.meta.HTTP.status = HTTPContext.STATUSES.partial;
    this.meta.HTTP.statusCode = 206;
    return resource;
}

function redirect(code, url) {
    this.meta.HTTP.status = HTTPContext.STATUSES.created;
    this.meta.HTTP.statusCode = code || 302;
    this.meta.HTTP.headers.url = url;
}

function stream(path) {
    this.meta.HTTP.status = HTTPContext.STATUSES.stream;
    this.meta.HTTP.statusCode = 200;
    this.meta.path = path;
}

function noContent(resource) {
    this.meta.HTTP.status = HTTPContext.STATUSES.noContent;
    this.meta.HTTP.statusCode = 204;
    return resource;
}

function error(code, message, ...args) {
    return Promise.reject(new ContextError(message, code, ...args));
}

module.exports = Context;