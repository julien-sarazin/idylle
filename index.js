const Promise = require('bluebird');

class Core {
    constructor() {
        this.router = require('express')();
        this.prepare = require('./lib/prepare')(this);
        this.context = require('./lib/context')(this);

        this.listeners = {};

        this.actions = {};
        this.middlewares = {};
        this.models = {};
        this.routes = {};
        this.settings = {};
    }

    static get events() {
        return {
            init: {
                settings: 'core.events.init.settings',
                middlewares: 'core.events.init.middlewares',
                models: 'core.events.init.models',
                actions: 'core.events.init.actions',
                routes: 'core.events.init.routes',
                cache: 'core.events.init.cache'
            },
            booting: 'core.events.starting',
            started: 'core.events.started'
        };
    }

    init() {
        const self = this;

        return initSettings()
            .then(initMiddlewares)
            .then(initModels)
            .then(initActions)
            .then(initRoutes)
            .then(initCache)
            .then(boot)
            .then(start)
            .then(started)
            .then(clean);


        function initSettings() {
            const promises = (self.listeners[Core.events.init.settings] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function initMiddlewares() {
            const promises = (self.listeners[Core.events.init.middlewares] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function initModels() {
            const promises = (self.listeners[Core.events.init.models] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function initActions() {
            const promises = (self.listeners[Core.events.init.actions] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function initRoutes() {
            const promises = (self.listeners[Core.events.init.routes] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function initCache() {
            const promises = (self.listeners[Core.events.init.cache] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function boot() {
            const promises = (self.listeners[Core.events.booting] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function start() {
            self.router.listen(self.settings.port);
        }

        function started() {
            const promises = (self.listeners[Core.events.started] || []).map((fn) => fn());
            return Promise.all(promises);
        }

        function clean() {
            self.listeners = {};
        }
    }

    start() {
        this.init();
    }

    on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];
        return this.listeners[event].push(listener.bind(listener, this));
    }
}


module.exports = Core;