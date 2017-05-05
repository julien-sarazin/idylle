# Idylle
[![Build Status](https://travis-ci.org/julien-sarazin/idylle.svg?branch=master)](https://travis-ci.org/julien-sarazin/idylle)

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
const Idylle      = require('Idylle');
const server    = new Idylle();


// Initialization phases.
server.on(Idylle.events.init.settings,        require('./settings'));
server.on(Idylle.events.init.models,          require('./models'));
server.on(Idylle.events.init.middlewares,     require('./middlewares'));
server.on(Idylle.events.init.actions,         require('./actions'));
server.on(Idylle.events.init.routes,          require('./routes'));
server.on(Idylle.events.init.cache,           require('./cache'));

// Starting phase.
server.on(Idylle.events.booting,              require('./boot'));
server.on(Idylle.events.booting,              require('./docs'));

// Post Start.
server.on(Idylle.events.started, (server) => {
    console.log(`Server listening on port ${server.settings.port}`);
});

// Launching server.
server.start();

test
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
