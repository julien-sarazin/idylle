
### Why another framework ?
Original team members behind Idylle come from different backgrounds like Front-End developers, Native Mobile Developers (iOS/Android), NodeJS lovers, PhP, J2EE, ...
We had different experiences with web framework like RoR, Spring Boot, Loopback, Sails, Meteor, Express..

So far we found that the choices were limited in two directions :  
 - either you choose a pretty big one like sails or loopback, which both have really intresting features but comes with a learning cost, meaning as soon as you want to do something specific that doesn't fit with their philosophy, you will need to have a full understanding of all concepts related to the framework you chose.
 - either you choose a small one, routing based, like express, hapi, restify, which are extremly fexible, where you can do pretty much anything you want, the way you want, but comes with a low productivity ratio since you will have to write much more boilerplate code.

Our Goal is to offer to the community a flexible micro framework that have a minimal learning curve with a great productivity ratio. 
Meaning you can do a lot within only few hours and the more you will use it, the more you will be able to do things, do it quickly, **in your way**.

We want the framework to be accessible for junior developers. 
Actually we have interns with less than 6 months of javascript development that work with Idylle every day to develop micro services with reasonable business logic 
and we are constantly asking for feedbacks to bring the most flexible architecture without increasing the usage complexity.
 
### Concepts

#### 1. Core
The `Core` is the reliable entity organizing the server initialization through specific events  
helping to glue all components together.


#### 2. Action
An `Action` is basically a `function` compliant with express that must return a `Promise`. Yes that's it.. for the main part :)  
Here how you can create an action : 

```javascript
Action({
    execute: (context) => {
        return new Promise((resolve, reject) => {
            resolve("something interesting");
        }) 
    }
})
```

> *You said it was compliant with express!*

Actually when you build an action, behind the scene you are configuring a class.
 
> *A class?! i'm lost.. it was supposed to be an express middleware..*

Since a function is also a class in javascript, we are using the execute property as 
a class, then we are adding to this function/class some properties like :

- a `validate` property, which is an array of functions that will receive the request,  
and must validate the inputs (request's body, queries or params)

- a `criteraBuilder` property which is a function that will transform the request's query into  
something understandable to your ORM/ODM (later injected into your context as a `criteria` property)

- a `cache` property, that will be used to store returned information from the promise you designed   
(if configured to do so)

- an `expose()` method that will transform your execute function into a middleware.  
This middleware will then serialize the request into a context (we'll back to this point later)

This way, you can focus on the business part


> *Ok, But why?*


Modularity, Reusability and Testability. Let'say you keep coding in an express midlleware all you business logic.
How can you separate the HTTP part to the real business part?

> *I can use a controller that will be used by my middleware*

Yes, you could, but it means the you will have something very tight to your controller's logic, you
will have to maintain not one but two layers of code for each business logic of each model.

This tidius job can be removed by using an Action. it takes care of the http part.
By analysing two things:   
  
  1. the state of the given Context
    When you work in your business logic, you can alter the context state by calling methods in on your context
    
  2. the state of the return Promise, if the promise si resolved, a code of range 2xx will be returned  
    if the promise is rejected, a code of range 3xx, 4xx or 5xx will be returned.

### Components
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

You should be able to init the server's settings like : 

```javascript

server.on(Core.events.init.settings, (settings) => { 
    _.merge(settings, require('settings.json'));
});
```


#### 2. Models
The `models` component concerns all entities related to persistency. This is the place where you connect your ORMS/ODMS like Sequelize or Mongoose and define the Classes/Schema that will be used by your business logic.

```javascript
server.on(Core.events.init.models, (models) => { 
    _.merge(models, {
        Foo: require('./Foo'),
        Bar: require('./Bar')
    });
});
```

#### 3. Middlewares
The `middlewares` component is really close to what you would use with a basic express application.  
It's a component that group all integrity validations, like :
 
```
  "does the requester has provided the required information for the targeted service? 
  "does the user is allowed to consume this endpoint?"
  "is he/she authenticated?"
  and so on...
```
 
 Again, to initialize this component, just register to the proper event like:  
```javascript
server.on(Core.events.init.middlewares, (server) => { 
    server.middlewares = {
        bodyParser: require('body-parser'),
        ensureAuthenticated: require('./ensureAuthenticated')
    };
 });
```

#### 4. Actions
The `actions` component is the business logic part. This is where all your intelligence will take place.

```javascript
server.on(Core.events.init.actions, (server) => { 
    server.actions = {
        'foos.create': require('./foos.create')(server),
        'foos.list': require('./foos.list')(server),
        'bars.create': require('./bars.create')(server),
        'bars.list': require('./bars.list')(server)
    };
});
```

#### 5. Routes
The `routes` component is not more than a pure express router.

```javascript
server.on(Core.events.init.routes, (server) => { 
    server.router.use('/foos', require('./foos.router'));
    server.router.use('/bars', require('./bars.router'));
 });
```


#### 6. CriteriaBuilder
The `CriteriaBuilder` is a specific component.   
Its goal is to serialize the express `req.query` into something understandable
for your actions. Meaning, if one action use an ODM like mongoose, its job will be to serialize the query
to make it compliant with the mongoose ODM. If you decide to change the ODM/ORM for a specific action, you will
just have to change the criteriaBuilder associated to it.

So far, we provide a default CriteriaBuilder that is capable of serializing any express query into a mongoose query.
The expected format is:

`http://api.com?criteria=<json_formatted_criteria>`

```javascript
{
    criteria: '{"limit": 0, "offset": 0, "sort": {}, "includes": []}'
}
```
> use `limit` to limit the number of results, it must be an integer between 0 and +∞,   
> use `offset` to skip a number of entries from the results, it must be an integer between 0 and +∞,  
> use `sort` to sort the results, it must be an object,  
> use `includes` to populate relations of results, it must be an array

##### `sort` parameter can take multiple forms like
```javascript
{
    "property": -1                 // means descending sort on the key property, 
    "dotec.nested.property": 1     // means ascending sort on the key property of an object with key "nested" of another object with key "dotec", 
}

```

##### `includes` parameter can also take multiple forms like

an array of strings

```json
[
    "relation1", "relation2"         
]
```

when you want to fetch nested relation like `bar` relation of `foo` relation of root objects

```json
[
    {"foo": "bar"}         
]
```

works for any depth

```json
[
    {
        "foo": {
            "bar": {
                "baz": "bim"
             }
        }
    }         
]
```

can fetch mutilple nested relation on the same depth
```json
[
    {
        "foo": {
            "bar": ["baz", "fut"]
        }
    }         
]
```

and you can combine styles
```json
[
    "faz", 
    "bun",  
    {
        "fiu": {
            "bar": ["baz", "fut"]
        }
    }         
]
```

> Documentation is still under development :)   
More will come really soon!
