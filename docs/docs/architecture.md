# Architecture
Idylle is a micro-framework on top of express (so far).
In terms of architecture Idylle encapsulate en express instance as a server, and use it as default HTTP server and a router.

Around this server, it defines few modules with specific responsabilities.

## Life cycle
![Screenshot](https://github.com/julien-sarazin/Idylle/raw/gh-pages/images/architecture-life-cycle.png)

### 1. Initialization
#### 1. Dependencies
The dependency module regroups all systems that can be override/extended.
At this time there are 4 dependencies with specific responsabilities :
  - CriteriaBuilder: Parse and serialize the request's query into something understandable for your persistency.
  - ErrorHandler: Handle how to respond to a request when an error has been raised during the flow.
  - ResponseHandler: Handle how to respond to a request when an action has succeeded.
  - CacheHandler: Handle how to apply the cache strategy  

#### 2. Settings
The settings module regroups all configuration information.
Most of the time they are static information stored in JSON or YAML file.


#### 3. Middlewares
The `middlewares` module is really close to what you would use with a basic express application.  
It's a component that regroup all integrity validations, like :

```
  "does the requester has provided the required information for the targeted service?
  "does the user is allowed to consume this endpoint?"
  "is he/she authenticated?"
  and so on...
```

 Again, to initialize this component, just register to the proper event like:  
```javascript
server.on(Core.events.init.middlewares, server => {
    server.middlewares = {
        bodyParser: require('body-parser'),
        ensureAuthenticated: require('./ensureAuthenticated')
    };
 });
```

#### 4. Models
The `models` module concerns all entities related to persistency. This is the place where you connect your ORMS/ODMS like Sequelize or Mongoose and define the Classes/Schema that will be used by your business logic.

```javascript
const _ = require('lodash');

server.on(Core.events.init.models, models => {
    _.merge(models, {
        Foo: require('./Foo'),
    });
});
```

#### 5. Actions
The `actions` module is the business logic part. This is where all your intelligence will take place.
An action will receive data as input (coming from client's request or another action), apply business logic, and connect it to an ORM/ODM to persist data.

```javascript
server.on(Core.events.init.actions, app => {
    server.actions = {
         create: require('./create')(app)
         list: require('./list')(app)
    };
});
```

#### 6. Routes
The `routes` component is not more than a pure express router.

```javascript
server.on(Core.events.init.routes, app => {
    app.server.use('/foos');
});
```

### 2. Loading phase
#### 7. Boot scripts
The `Boot Scripts` module regroups all processes that should be started just before
the server starts listening. Like creating a connection to the databases, initializing Tables if the database is empty, ....

### 3. Post start phase
#### 8. Post start scripts
The `Post start script` as its name indicates is scrips/processes launched after the server started listening on a port.



## Archetypes
An archetype is a project layout. It means how you will organize your modules.  
Here is the default Idylle archetype :
```
    . actions/    
        . index.js
        . resource/
            . index.js
            . create.js
            . update.js
            . ...
    . models/
        . index.js
        . resource.js
        . ...
    . middlewares/
        . index.js
        . ...
    . routes/
        . index.js
        . resources.js
    . settings/
        . index.js
        . settings.json
        . xy.json
        . ...
    . docs/
        . index.js
        . statics.js
        . site/
            ....
    . utils/
        . index.js
        . ...
    . index.js
    . package.json
    . .gitignore
    . .....
```
