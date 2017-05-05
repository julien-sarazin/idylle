const CriteriaBuilder = require('./CriteriaBuilder');

module.exports = (server) => {

    server.criteriaBuilder

    return {
        get: (req, res) => {
            const context = {};

            context.criteria = CriteriaBuilder.build(req.query);
            context.params = req.params;
            context.data = req.body;
            context.files = req.files;
            context.token = req.token;

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
    };
};