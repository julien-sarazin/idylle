module.exports = (server) => {
    return (action) => {
        return (req, res) => {
            // 1. Generate a context from the middleware, req : res
            const context = server.context.get(req, res);

            // 2. If the action has configured a cache action
            // tries to get the cache entry from the req's url.
            if (action.cache && action.cache.store) {
                const entry = server.cache.get(req.originalUrl);
                if (entry)
                    return context._submit(entry);
            }
            // 3. else if the cache has been configured to bust some entries..
            else if (action.cache && action.cache.bust)
                server.cache.remove(action.cache.bust);


            // >>> CORE FLOW :
            // 1. Executing the action
            // 2. Setting a cache entry if configured to do so.
            // 3. Responding to the client.
            // 4. Handling the error and responding to the client.
            action.execute(context)
                .then(setCache)
                .then(context._submit)
                .catch(res.error);

            function setCache(data) {
                if (action.cache && action.cache.store)
                    server.cache.set(action.cache, req.originalUrl, data);

                return data;
            }
        };
    };
};