const CriteriaBuilder = require('./CriteriaBuilder');

class ContextBuilder {
    constructor(criteriaBuilder){
        this.criteriaBuilder = criteriaBuilder || new CriteriaBuilder();
    }

    build(req, res) {
        const context = {};

        decorate(res);

        context._req = req;

        context.criteria = this.criteriaBuilder.build(req.query);
        console.log('criteria', context.criteria);

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

        function decorate(context) {
            res.created = () => {
                return res.status(201).send();
            };

            res.noContent = () => {
                return res.status(204).send();
            };

            res.partial = (partial) => {
                return res.status(206).send(partial);
            };

            res.submit = (data) => {
                res.send(data);
            };

            res.error = (error) => {
                if (error.code && error.code >= 300 && error.code <= 500)
                    return res.status(error.code).send(error.reason);

                console.log(error.toString(), JSON.stringify(error));
                return res.status(500).send();
            };
        }
    }
}

module.exports = ContextBuilder;