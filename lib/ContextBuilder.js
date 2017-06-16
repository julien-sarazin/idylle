const _ = require('lodash');

class ContextBuilder {
    constructor(criteriaBuilder){
        if (typeof (criteriaBuilder) !== 'object')
            throw new Error('Invalid CriteriaBuilder');

        this.criteriaBuilder = criteriaBuilder;
    }

    normalize(context) {
        context = context || {};
        context.criteria = _.merge(context.criteria, this.criteriaBuilder.default());

        context.meta = {};

        context.ok = (resource) => {
            return resource;
        };

        context.created = (resource) => {
            if (resource && resource.uri)
                context.meta.status = "created";
            context.meta.resourceURI =  resource.uri;

            return resource;
        };

        context.partial = (resource) => {
            context.meta.status = "partial";
            return resource;
        };

        context.noContent = (resource) => {
            context.meta.status = "noContent";
            return resource;
        };

        context.redirect = (code, url) => {
            context.meta.status = 'redirect';
            context.meta.code = code || 302;
            context.meta.url = url;
        };

        context.stream = (path) => {
            context.meta.status = 'stream';
            context.meta.path = path;
        };
    }

    build(req, res) {
        const context = {};
        context.request     = req;
        context.params      = req.params;
        context.data        = req.body;
        context.files       = req.files;
        context.token       = req.token;
        context.session     = req.session;
        context.user        = req.user;

        context.criteria  = this.criteriaBuilder.build(req.query);
        context.setHTTPHeaders = (headers) => {
            for (let header in headers)
                if (headers.hasOwnProperty(header))
                    res.header(header, headers[header])
        }

        return context;
    }
}

module.exports = ContextBuilder;