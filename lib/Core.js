const express = require('express');
const Promise = require('bluebird');
const Action = require('./Action');
const _ = require('lodash');
const imports = require('./utils/imports');

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = '0.0.0.0';

class Idylle {
    constructor() {
        this.errorHandler = undefined;
        this.settings = {port: DEFAULT_PORT, host: DEFAULT_HOST};
        this.cache = {};
        this.actions = {};
        this.middlewares = {};
        this.models = {};
        this.Router = null;
        this.server = null;
        this.listeners = {};
    }

    static get events() {
        return {
            init: {
                dependencies: 'Idylle.events.init.dependencies',
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

        return initDependencies()
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

        function initDependencies() {
            return load(Idylle.events.init.dependencies)
                .then(setDependencies)
                .then(attachDependenciesToAction);

            function setDependencies(dependencies) {
                let dependency = _.last(dependencies) || {};

                self.criteriaBuilder = dependency.criteriaBuilder || require('./CriteriaBuilder');
                self.errorHandler = dependency.errorHandler || require('./ErrorHandler');
                self.responseHandler = dependency.responseHandler || require('./ResponseHandler');
                self.server = dependency.server || express();
                self.Router = dependency.Router || express.Router;
            }

            function attachDependenciesToAction() {
                Action.criteriaBuilder = new self.criteriaBuilder();
                Action.responseHandler = self.responseHandler;
                Action.errorHandler = self.errorHandler;
            }
        }

        function initSettings() {
            return load(Idylle.events.init.settings)
                .then(loaded => (loaded.length) ? undefined : imports('./settings', {args: self.settings}))
        }

        function initMiddlewares() {
            return load(Idylle.events.init.middlewares)
                .then(loaded => (loaded.length) ? undefined : imports('./middlewares', {args: self}).then(m => self.middlewares = m))
        }

        function initModels() {
            return load(Idylle.events.init.models)
                .then(loaded => (loaded.length) ? undefined : imports('./models').then(m => self.models = m))
        }

        function initActions() {
            return load(Idylle.events.init.actions)
                .then(loaded => (loaded.length) ? undefined : imports('./actions', {args: self}).then(a => self.actions = a))
        }

        function initRoutes() {
            return load(Idylle.events.init.routes)
                .then(loaded => (loaded.length) ? undefined : imports('./routes', {args: self}))
        }

        function initCache() {
            return load(Idylle.events.init.cache)
                .then(loaded => (loaded.length) ? undefined : imports('./cache', {args: self.cache}))
        }

        function attachCacheToAction() {
            if (!self.cache)
                return undefined;

            Action.cache = self.cache;
        }

        function boot() {
            return load(Idylle.events.booting)
                .then(loaded => (loaded.length) ? undefined : imports('./boot', {args: self}))
        }

        function start() {
            return self.server.listen(self.settings.port, self.settings.host);
        }

        function started() {
            return load(Idylle.events.started);
        }

        function clean() {
            self.listeners = {};
        }

        function load(component) {
            const promises = (self.listeners[component] || []).map((fn) => fn());
            return promises ? Promise.all(promises) : Promise.resolve(false);
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
            this.add(listener, event, this.settings);

        else if (event === Idylle.events.init.dependencies)
            this.add(listener, event, undefined);
        else
            this.add(listener, event, this);

        return this;
    }

    add(listener, onEvent, withObject) {
        this.listeners[onEvent].push(listener.bind(listener, withObject));
    }
}

module.exports = Idylle;

class InvalidServerError extends Error {
    constructor(fn) {
        super();
        this.name = 'InvalidServerError';
        this.message = `expecting function server got ${typeof fn} \n ${this.stack}`
    }
}