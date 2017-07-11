# Getting started
Follow the path to quickly dive into the micro framework.

## Installation

```bash
npm init

npm install --save idylle
npm install --save express
npm install --save lodash
```

## The Quick start

```bash
$ npm install -g idylle-cli
$ npm new <my_project>
$ cd my_project
$ npm i
$ npm start
```

## Setting up your server from scratch
When you work with Idylle, everything is related to a `Core`. Once instantiated, you just need to start it.

Create a file `index.js` and write this down:
```javascript
const Core = require('idylle').Core;
const app = new Core();

app.start();
```

By default the server's listens on `0.0.0.0` on port `8000`. If you check in your browser at `localhost:8000` you should the the famous express's error handling `cannot GET /`.

## 1. Configuring the server
When it comes to configure the server, you need to listen on a specific event `Core.events.init.settings`.

```javascript
app.on(Core.events.init.settings, settings => {
  settings.port = 3000;
  settings.access_token = '$0m37h1n68cr37';
  ....
});
```
Be aware that you can listen multiple time on the same event in case you want to split the configuration loading in different step.

```javascript
app.on(Core.events.init.settings, settings => {
  // attaching security properties to the settings...
});

app.on(Core.events.init.settings, settings => {
  // attaching database properties...
});

// ...
```
You are even able to return a promise that will make the core system wait your promise is resolved to continue loading.


```javascript
app.on(Core.events.init.settings, settings => {
  return new Promise((resolve, reject) => {
      // request something from a configuration server..
      // then resolve().
  });
});
```


## 2. Your first Action
An action deals with the business part. It means **there is no HTTP concept** in an Action. Your job is to ensure that the given input is correct to avoid unexpected behavior.

!!!Warning "Be careful"
     The Action **must** have an `execute` property which must be a **function** that **must** return a `Promise`.

Create a file `itWorks.js` and write the following code:
```javascript
module.exports = app => {
  return Action({
    execute: context => {
        return Promise.resolve('it works!');
    }
  });
}
```
Once defined, the action can be attached to the `Core` via the init event `Core.events.init.actions` :

```javascript
...
app.on(Core.events.init.actions, app => {
  app.actions = {
    itWorks: require('./itWorks.js')(app)
  };
});
```
That's it!  
A context will be injected to you action, end what the promise will resolve will be sent to the client.

## 3. Routing
You just developed your first Action, which does not do much except returning a promise that will resolve a string `"it works!"`. At this point, you could use it in your app through `app.actions.itWorks()`, but no one can reach this action through an HTTP request.  

To do so, you need to register the action's  during the `Core.events.init.routes` :

```javascript hl_lines="3"
app.on(Core.events.init.routes, app => {
  app.server.get('/',
    app.actions.itWorks.expose()
  );
});
```

!!! info "About the Idylle bundled server"
    The server is an express `HTTPServer`, meaning the routing is compliant with **express only**. We are working to bring more flexiblity regarding this part, and let you decide what kind of routing you want to use.


What you need to notice is the `expose()` function used during the routing.  

Has explained few lines before, an **Action is not related to the HTTP concepts**, but since the routing has to be compliant with express, an Action can **mutate itself into an express middleware**.

Try again in your favorite browser `localhost:8000`. It should now print `"it works!"`.


## 4. Registering your first model

Idylle does not enforce an ORM/ODM more than other. But for the documentation purposes, we will demonstrate how you can use Idylle with `mongoose`.

```bash
npm install --save mongoose
```

Once installed, you can use it to define your first model:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = Schema({
  title: String,
  dueDate: Date
});

return mongoose.model('Todo', TodoSchema);
```
Then as for each part of Idylle, you need to listen on an event to load your models.

```javascript
app.on(Core.events.init.models, models => {
  models.Todo = require('./models/Todo');
});
```

## 5. Your first CRUD
Let's create CRUD (Create. Read. Update. Delete.) actions.
You can get the project structure by checking out the crud branch of our sample repository.

```bash
git clone https://github.com/julien-sarazin/idylle-sample
git checkout getting-started-crud
```

Your directory structure should look like this.

```
# regroups all your actions
actions/
  . index.js      
  . todos/
      . index.js
      . create.js
      . list.js
      . show.js
      . update.js
      . delete.js
# regroups all models
models/
  . index.js
  . Todo.js
# regroups all routes
routes/
  . index.js
  . todos.js
# entry point to your server.
index.js

```

#### 5.1 Creation
Go to your `actions/todos/create.js` and write this:

```javascript hl_lines="2 6"
module.exports = app => {
  const Todo = app.models.Todo;

  return Action({
    execute: context => {
        return Todo.create({
          title: context.data.title,
          dueDate: context.data.dueDate
        });
    }
  });
}
```

What happens here? We used the previously defined `Todo` model in our action. Thanks to the mongoose ODM the method `.create(..)` returns a promise that will be resolved if the operation worked.


#### 5.2 Reading
Go to the file `actions/todos/show.js` and write this:

```javascript
module.exports = app => {
    const Todo = app.models.Todo;

    return Action({
        execute: context => {
            return Todo.findOne(context.criteria.where)
        }
    });
}
```
Here we did the same than for the create action. We communicate with the Model module to benefit from ORM features, then executing the action to find one result matching the criteria.

Go to the file `actions/todos/list.js` and write this:
```javascript
module.exports = app => {
    const Todo = app.models.Todo;

    return Action({
        execute: context => {
            return Todo.find(context.criteria.where)
        }
    });
}
```
Same than the previous one but with a list.

#### 5.3 Updates
Go to the file `actions/todos/update.js` and write this:

```javascript
module.exports = app => {
    const Todo = app.models.Todo;

    return Action({
        execute: context => {
            return Todo.update(context.params.id, context.data);
        }
    });
}
```


#### 5.4 Remove
Go to the file `actions/todos/remove.js` and write this:

```javascript
module.exports = app => {
    const Todo = app.models.Todo;

    return Action({
        execute: context => {
            return Todo.remove(context.params.id);
        }
    });
}
```

#### 5.5 Routing
Go to file `routes/todos.js` and add this :

```javascript
module.exports = app => {
    const router = app.Router();

    router
        .get('/',
            app.actions.todos.list.expose()
        )

        .get('/:id',
            app.actions.codes.show.expose()
        )

        .post('/',
            app.actions.codes.create.expose()
        )

        .put('/:id',
            app.actions.codes.update.expose()
        )

        .delete('/:id',
            app.actions.codes.remove.expose()
        )

    return router;
};
```


Now restart your server and you should be able to request your server on `localhost:8080` on 5 routes to `Create`, `Read` (one or multiple), `Update` and `Remove` Todos.

This getting started is over, thanks to have taken the time to reach the end, i hope it was useful.  
