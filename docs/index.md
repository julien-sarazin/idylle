# Idylle
[![Build Status](https://travis-ci.org/julien-sarazin/Idylle.svg?branch=master)](https://travis-ci.org/julien-sarazin/Idylle.svg?branch=master)

A micro framework on top of express.


### Why ?
Original team members behind Idylle come from different backgrounds like Front-End developers, Native Mobile Developers (iOS/Android), NodeJS lovers, PhP, J2EE, ...
We had different experiences with web framework like RoR, Spring Boot, Loopback, Sails, Meteor, Express..

Our Goal is to offer to the community a framework that have a minimal learning curve with a great productivity curve. Meaning that the more you know, the more you will be able to do things, and do it quickly.

We want the framework to be accessible for junior developers. Actually we have interns with less than 6 months of javascript development that work on Idylle every day and we are constantly asking for feedbacks to bring the most flexible architecture without increasing the usage complexity.
 


### Concepts
#### 1. Settings
The `settings` module concerns all information used by the server as configuration.
Yes, it's very flimsy and that what we want. 
Generally developers use configuration files to set information like `port` or `db_uri` but what if you wanted to use the settings to store basic ACL information, API keys, Tokens, dependencies, etc..? Well, we're not forbidding anything, the only thing Idylle is using for the setting, is the `port` information.

Here an example of one of our settings file `settings.development.json`

```json
{
    "version": 1,
    "security": {
        "salt": "D5$fds0K/+.KJH",
        "ttl": "1h"
    },
    "db": {
        "url": "mongodb://localhost:27017/sample-dev"
    },
    "boot": {
        "user": {
            "email": "root@root.com",
            "password": "root",
            "first_name": "root",
            "last_name": "root"
        }
    },
    "policies": {
        "trust": true
    },
    "logger": "tiny"
}
```

As you can see, we use a json file (which again, could be any format you want) that set few information about our server.

#### 2. Models
The `models` module concerns all entities related to persistency. This is the place where you connect your ORMS/ODMS like Sequelize or Mongoose and define the Classes/Schema that will be used by your business logic.


#### 3. Middlewares
The `middlewares` module is really close to what you would use with a basic express application. It a module that group all integrity validation, like does the requester has provided the required information for the targeted service? does the user is allowed to consume this endpoint ? is he/she authenticated? and so on...

#### 4. Actions
The `actions` module is the business logic part. This is where all your intelligence will take place.


#### 5. Routes
The `routes` module is not more than a pure express router.

### How ?
As said at the very beginning, it's a micro framework on top of express. Thus to not break with the most used web framework, that over the years, became a standard in nodejs applications. 

What we are doing with Idylle is setting up modules to the Core.



### Usage
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


