const express = require('express');
const Promise = require('bluebird');
const Action = require('./Action');

const DEFAULT_PORT = 8080;

class Idylle {
    constructor() {
        this.criteriaBuilder = undefined;
        this.router = undefined;

        this.cache          = {};
        this.actions        = {};
        this.middlewares    = {};
        this.models         = {};
        this.routes         = {};
        this.settings       = {};
        this.listeners      = {};
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

    _setup() {
        this.router = express();
        this.router.use(decorateResponse);

        function decorateResponse(req, res, next) {
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

            next();
        }
    }

    init() {
        const self = this;

        self._setup();

        return initCriteriaBuilder()
            .then(initSettings)
            .then(initMiddlewares)
            .then(initModels)
            .then(initCache)
            .then(attachCacheToAction)
            .then(initActions)
            .then(initRoutes)
            .then(boot)
            .then(start)
            .then(started)
            .then(clean);


        function load(component) {
            const promises = (self.listeners[component] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : undefined;
        }

        function initCriteriaBuilder() {
            return load(Idylle.events.init.criteriaBuilder);
        }

        function initSettings() {
            return load(Idylle.events.init.settings);
        }

        function initMiddlewares() {
            return load(Idylle.events.init.middlewares);
        }

        function initModels() {
            return load(Idylle.events.init.models);
        }

        function initActions() {
            return load(Idylle.events.init.actions);
        }

        function initRoutes() {
            return load(Idylle.events.init.routes);
        }

        function initCache() {
            return load(Idylle.events.init.cache);
        }

        function attachCacheToAction() {
            if (!self.cache)
                return undefined;

            Action.cache = self.cache;
        }

        function boot() {
            return load(Idylle.events.booting);
        }

        function start() {
            return self.router.listen(self.settings.port || DEFAULT_PORT);
        }

        function started() {
            return load(Idylle.events.started);
        }

        function clean() {
            self.listeners = {};
        }
    }

    start() {
        this.init();
    }

    /**
     * Register a function as a listener of the core.
     * @param event {String}
     * @param listener {function}
     */
    on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];

        if (event === Idylle.events.init.settings)
            return this.listeners[event].push(listener.bind(listener, this.settings));

        if (event === Idylle.events.init.models)
            return this.listeners[event].push(listener.bind(listener, this.models));

        if (event === Idylle.events.init.criteriaBuilder)
            return this.listeners[event].push(listener.bind(listener, this.criteriaBuilder));

        if (event === Idylle.events.init.cache)
            return this.listeners[event].push(listener.bind(listener, this.cache));

        this.listeners[event].push(listener.bind(listener, this));
    }
}

module.exports = Idylle;