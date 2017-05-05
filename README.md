# Idyll
A micro framework on top of express.


## Usage

```javascript
const Idyll      = require('Idyll');
const server    = new Idyll();


// Initialization phases.
server.on(Idyll.events.init.settings,        require('./settings'));
server.on(Idyll.events.init.models,          require('./models'));
server.on(Idyll.events.init.middlewares,     require('./middlewares'));
server.on(Idyll.events.init.actions,         require('./actions'));
server.on(Idyll.events.init.routes,          require('./routes'));
server.on(Idyll.events.init.cache,           require('./cache'));

// Starting phase.
server.on(Idyll.events.booting,              require('./boot'));
server.on(Idyll.events.booting,              require('./docs'));

// Post Start.
server.on(Idyll.events.started, (server) => {
    console.log(`Server listening on port ${server.settings.port}`);
});

// Launching server.
server.start();

// Exposing the router allowing e2e tests.
module.exports = server;
```
