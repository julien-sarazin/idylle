# Idylle
[![Build Status](https://travis-ci.org/julien-sarazin/Idylle.svg?branch=master)](https://travis-ci.org/julien-sarazin/Idylle.svg?branch=master)
[![npm version](https://badge.fury.io/js/idylle.svg)](https://badge.fury.io/js/idylle)
[![dependencies status](https://david-dm.org/julien-sarazin/Idylle.svg)](https://david-dm.org/julien-sarazin/Idylle.svg)
[![Test Coverage](https://codeclimate.com/github/julien-sarazin/Idylle/coverage.svg)](https://codeclimate.com/github/julien-sarazin/Idylle/coverage)

A micro framework on top of express.

To know more about the Idylle, our choices and concepts related to it, you can check the [documentation](https://julien-sarazin.github.io/Idylle/).


### Quick Usage
1. Setup a vanilla server

```javascript
const Core      = require('idylle').Core;
const server    = new Core();

// Launching server.
server.start(); // default port is 8080

// Exposing the server allowing tests.
module.exports = server;
```

2. Setting up components


```javascript
// Initializing Components.
server.on(Core.events.init.settings, (settings) => { settings.port = 3000; });
server.on(Core.events.init.models, (models) => { ... });
server.on(Core.events.init.middlewares, (server) => { ... });
server.on(Core.events.init.actions, (server) => { ... });
server.on(Core.events.init.routes, (server) => { ... });
```


3. Running custom code after specific server's lifetime events

```javascript
// Starting phase.
server.on(Core.events.booting, (server) => {...});
server.on(Core.events.booting, (server) => {...});          

// Post Start.
server.on(Core.events.started, (server) => {
    console.log(`Server listening on port ${server.settings.port}`);
});
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






