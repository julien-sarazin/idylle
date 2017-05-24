const express = require('express');
const Promise = require('bluebird');
const Action = require('./Action');
const _ = require('lodash');

const DEFAULT_PORT = 8080;

class Idylle {
    constructor() {
        this.errorHandler = undefined;

        this.settings = {port: DEFAULT_PORT};
        this.cache = {};
        this.actions = {};
        this.middlewares = {};
        this.models = {};
        this.router = express();
        this.listeners = {};
    }

    static get events() {
        return {
            init: {
                errorHandler: 'Idylle.events.init.error_handler',
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
                next(error);
            };

            next();
        }
    }

    init() {
        const self = this;

        self._setup();

        return initCriteriaBuilder()
            .then(initErrorHandler)
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

        function initCriteriaBuilder() {
            let CriteriaBuilder;
            return load(Idylle.events.init.criteriaBuilder)
                .then((c) => CriteriaBuilder = _.last(c) || require('./CriteriaBuilder'))
                .then(setCriteriaBuilderToAction);

            function setCriteriaBuilderToAction() {
                Action.criteriaBuilder = new CriteriaBuilder();
            }
        }

        function initErrorHandler() {
            return load(Idylle.events.init.errorHandler)
                .then((fn) => self.errorHandler = _.last(fn) || require('./ErrorHandler'))
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
            return load(Idylle.events.init.routes)
                .then(setErrorHandler);

            function setErrorHandler() {
                self.router.use(self.errorHandler);
            }
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
            return self.router.listen(self.settings.port);
        }

        function started() {
            return load(Idylle.events.started);
        }

        function clean() {
            self.listeners = {};
        }

        function load(component) {
            const promises = (self.listeners[component] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : Promise.resolve();
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
            return this.add(listener, event, this.settings);

        if (event === Idylle.events.init.models)
            return this.add(listener, event, this.models);

        if (event === Idylle.events.init.cache)
            return this.add(listener, event, this.cache);

        if (event === Idylle.events.init.errorHandler || event === Idylle.events.init.criteriaBuilder)
            return this.add(listener, event, undefined);

        this.add(listener, event, this);
    }

    add(listener, onEvent, withObject) {
        this.listeners[onEvent].push(listener.bind(listener, withObject));
    }

}

module.exports = Idylle;