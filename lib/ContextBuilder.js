const CriteriaBuilder = require('./CriteriaBuilder');

class ContextBuilder {
    constructor(criteriaBuilder){
        this.criteriaBuilder = criteriaBuilder || new CriteriaBuilder();
    }

    build(req, res) {
        const context = {};

        context.request     = req;
        context.params      = req.params;
        context.data        = req.body;
        context.files       = req.files;
        context.token       = req.token;
        context.session     = req.session;

        context.criteria    = this.criteriaBuilder.build(req.query);

        context.created = (resource) => {
            if (resource.uri)
                res.header('location', resource.uri);
            res.submit = res.created
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