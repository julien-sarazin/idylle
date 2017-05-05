const express = require('express');
const Promise = require('bluebird');
const ContextBuilder = require('./lib/ContextBuilder');

const DEFAULT_PORT = 8080;

class Idylle {
    constructor() {
        this.criteriaBuilder = undefined;
        this.router = express();
        this.actions = {};
        this.middlewares = {};
        this.models = {};
        this.routes = {};
        this.settings = {};

        this.listeners = {};
    }

    static get events() {
        return {
            init: {
                criteriaBuilder: 'Idylle.events.init.criteria_builder',
                settings: 'Idylle.events.init.settings',
                middlewares: 'Idylle.events.init.middlewares',
                models: 'Idylle.events.init.models',
                actions: 'Idylle.events.init.actions',
                routes: 'Idylle.events.init.routes',
                cache: 'Idylle.events.init.cache'
            },
            booting: 'Idylle.events.starting',
            started: 'Idylle.events.started'
        };
    }

    init() {
        const self = this;

        return initCriteriaBuilder()
            .then(initSettings)
            .then(initMiddlewares)
            .then(initModels)
            .then(initActions)
            .then(initRoutes)
            .then(initCache)
            .then(boot)
            .then(start)
            .then(started)
            .then(clean);


        function initCriteriaBuilder() {
            const promises = (self.listeners[Idylle.events.init.criteriaBuilder] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function initSettings() {
            const promises = (self.listeners[Idylle.events.init.settings] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function initMiddlewares() {
            const promises = (self.listeners[Idylle.events.init.middlewares] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function initModels() {
            const promises = (self.listeners[Idylle.events.init.models] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function initActions() {
            const promises = (self.listeners[Idylle.events.init.actions] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function initRoutes() {
            const promises = (self.listeners[Idylle.events.init.routes] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function initCache() {
            const promises = (self.listeners[Idylle.events.init.cache] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function boot() {
            const promises = (self.listeners[Idylle.events.booting] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function start() {
            return self.router.listen(self.settings.port || DEFAULT_PORT);
        }

        function started() {
            const promises = (self.listeners[Idylle.events.started] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function clean() {
            return self.listeners = {};
        }
    }

    start() {
        this.init();
    }

    on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];

        if (event === Idylle.events.init.settings)
            return this.listeners[event].push(listener.bind(listener, this.settings));

        if (event === Idylle.events.init.criteriaBuilder)
            return this.listeners[event].push(listener.bind(listener, this.criteriaBuilder));

        return this.listeners[event].push(listener.bind(listener, this));
    }

    prepare(action) {
        const self = this;

        return (req, res) => {
            // 1. Generate a context from the middleware, req : res
            const context = new ContextBuilder(self.criteriaBuilder).build(req, res);

            // 2. If the action has been configured with a cache action
            // try to get the cache entry from the req's url.
            if (action.cache && action.cache.store) {
                const entry = self.cache.get(req.originalUrl);
                if (entry)
                    return context._submit(entry);
            }
            // 3. else if the cache has been configured to bust some entries..
            else if (action.cache && action.cache.bust)
                self.cache.remove(action.cache.bust);


            // >>> Idylle FLOW :
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
                    self.cache.set(action.cache, req.originalUrl, data);

                return data;
            }
        };
    };
}

module.exports = Idylle;