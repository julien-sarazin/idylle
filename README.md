# Idyll
A micro framework on top of express.


### Why ?
.. TODO

### How ?
.. TODO

### Concepts
.. TODO

### Modules
...TODO

### Usage

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

### License
MIT License

Copyright (c) 2017 Julien Sarazin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
