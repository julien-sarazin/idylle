class ContextBuilder {
    constructor(criteriaBuilder){
        if (typeof (criteriaBuilder) !== 'object')
            throw new Error('Invalid CriteriaBuilder');

        this.criteriaBuilder = criteriaBuilder;
    }

    normalize(context) {
        if (!context)
            context = {};

        if (!context.criteria)
            context.criteria = this.criteriaBuilder.default()
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

        context.criteria    = this.criteriaBuilder.build(req.query);

        context.ok = (resource) => {
            res.submit = res.send;
            return resource;
        };

        context.created = (resource) => {
            if (resource && resource.uri)
                res.header('location', resource.uri);
            res.submit = res.created;
            return resource;
        };

        context.partial = () => {
            res.submit = res.partial;
        };

        context.noContent = () => {
            res.submit = res.noContent;
        };

        context.redirect = (code, url) => {
            code = code || 302;
            res.submit = res.bind(res, code, url);
        };

        context.stream = (data) => {
            res.submit = res.download;
            return data;
        };

        /**
         * Private function that allows the override the reference of
         * res later (i.e in the promise chain).
         * @param data - the data returned by the action's promise
         */
        context._submit = (data) => {
            res.submit(data);
        };

        return context;
    }
}

module.exports = ContextBuilder;