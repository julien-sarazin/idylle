const ContextBuilder = require('./ContextBuilder');
const Promise = require('bluebird');

module.exports = Action;

function Action(options) {
    const criteriaBuilder = options.criteriaBuilder || Action.criteriaBuilder;
    if (typeof(criteriaBuilder) !== 'object')
        throw new InvalidCriteriaBuilderError(criteriaBuilder);

    const execute = options.execute;
    if (typeof(execute) !== 'function')
        throw new InvalidExecuteFunctionError(execute);

    const rules = options.rules ? (options.rules instanceof Array) ? options.rules : [options.rules] : [];

    const fn = function (context) {
        context = new ContextBuilder(criteriaBuilder).normalize(context);

        return Promise.each(rules, rule => (typeof rule === 'function') && rule(context))
            .return(context)
            .then(execute);
    };

    fn.cache = options.cache;
    fn.criteriaBuilder = criteriaBuilder;

    fn.expose = function () {
        const self = this;

        return (req, res, next) => {
            // 1. Generate a context from the middleware, req : res
            const context = new ContextBuilder(self.criteriaBuilder).build(req, res);

            // 2. If the action has been configured with a cache action
            // try to get the cache entry from the req's url.
            if (Action.cache && self.cache && self.cache.store) {
                const entry = Action.cache.get(req.originalUrl);
                if (entry)
                    return Action.responseHandler(req, res, entry);
            }
            // 3. else if the cache has been configured to bust some entries..
            else if (Action.cache && self.cache && self.cache.bust)
                Action.cache.remove(self.cache.bust);


            // >>> Idylle FLOW :
            // 1. Executing the action
            // 2. Setting a cache entry if configured to do so.
            // 3. Responding to the client.
            // 4. Handling the error and responding to the client.
            self(context)
                .then(setCache)
                .then(handleResponse)
                .catch(handleError);

            function setCache(data) {
                if (Action.cache && self.cache && self.cache.store)
                    Action.cache.set(self.cache, req.originalUrl, data);

                return data;
            }

            function handleResponse(result) {
                return Action.responseHandler(req, res, context, result);
            }

            function handleError(error) {
                return Action.errorHandler(req, res, error);
            }
        };
    };

    fn.expose = fn.expose.bind(fn);
    return fn
}

class InvalidExecuteFunctionError extends Error {
    constructor(fn) {
        super();
        this.name = 'InvalidExecuteFunctionError';
        this.message = `expecting function got ${typeof fn} \n ${this.stack}`
    }
}

class InvalidCriteriaBuilderError extends Error {
    constructor() {
        super();
        this.name = 'InvalidCriteriaBuilderError';
        this.message = `expecting object got ${typeof obj}`
    }
}