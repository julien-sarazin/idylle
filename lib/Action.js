const ContextBuilder = require('./ContextBuilder');

module.exports = Action;

function Action(options) {
    const fn = options.execute;
    if (typeof(fn) !== 'function')
        throw new InvalidExecuteFunctionError(fn);

    fn.cache = options.cache;
    fn.validator = options.validator;
    fn.criteriaBuilder = options.criteriaBuilder;

    fn.prepare = function () {
        const self = this;

        return (req, res) => {
            // 1. Generate a context from the middleware, req : res
            const context = new ContextBuilder(self.criteriaBuilder).build(req, res);

            // 2. If the action has been configured with a cache action
            // try to get the cache entry from the req's url.
            if (Action.cache && self.cache && self.cache.store) {
                const entry = Action.cache.get(req.originalUrl);
                if (entry)
                    return context._submit(entry);
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
                .then(context._submit)
                .catch(res.error);

            function setCache(data) {
                if (Action.cache && self.cache && self.cache.store)
                    Action.cache.set(self.cache, req.originalUrl, data);

                return data;
            }
        };
    };

    fn.prepare = fn.prepare.bind(fn);

    return fn
}


function InvalidExecuteFunctionError(fn) {
    this.name = 'InvalidExecuteFunctionError';
    this.message = `expecting function got ${typeof fn}`
}

InvalidExecuteFunctionError.prototype = Object.create(Error.prototype);