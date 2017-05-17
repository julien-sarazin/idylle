
### Why ?
Original team members behind Idylle come from different backgrounds like Front-End developers, Native Mobile Developers (iOS/Android), NodeJS lovers, PhP, J2EE, ...
We had different experiences with web framework like RoR, Spring Boot, Loopback, Sails, Meteor, Express..

Our Goal is to offer to the community a framework that have a minimal learning curve with a great productivity curve. Meaning you can do a lot with it only in few hours and the more you will use it, the more you will be able to do things, and do it quickly.

We want the framework to be accessible for junior developers. Actually we have interns with less than 6 months of javascript development that work with Idylle every day and we are constantly asking for feedbacks to bring the most flexible architecture without increasing the usage complexity.
 


### Concepts
#### 1. Settings
The `settings` component concerns all information used by the server as configuration.
Yes, it's very flimsy and that what we want.   
Generally developers use configuration files to set information like `port` or `db_uri` but what if you wanted to use the configuration to store basic ACL information, API keys, Tokens, dependencies, ..? Well, we're not forbidding anything, the only thing Idylle is using from the settings, is the `port` information.

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
The `models` component concerns all entities related to persistency. This is the place where you connect your ORMS/ODMS like Sequelize or Mongoose and define the Classes/Schema that will be used by your business logic.


#### 3. Middlewares
The `middlewares` component is really close to what you would use with a basic express application. It a component that group all integrity validation, like does the requester has provided the required information for the targeted service? does the user is allowed to consume this endpoint ? is he/she authenticated? and so on...

#### 4. Actions
The `actions` component is the business logic part. This is where all your intelligence will take place.


#### 5. Routes
The `routes` component is not more than a pure express router.

### How ?
As said at the very beginning, it's a micro framework on top of express. Thus to not break with the most used web framework, that over the years, became a standard in nodejs applications. 

What we are doing with Idylle is setting up components to the Core.



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

