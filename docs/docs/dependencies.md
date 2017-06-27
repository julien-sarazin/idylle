# Dependencies
Dependencies are small modules that can be replaced/unplugged/override in Idyille.

## 1. CriteriaBuilder
The CriteriaBuilder serialize the express `req.query` into something understandable for your actions. Meaning, if one action use an ODM like mongoose, its job will be to serialize the query to make it compliant with the mongoose ODM. If you decide to change the ODM/ORM for a specific action, you will just have to change the criteriaBuilder associated to it.

So far, we provide a default CriteriaBuilder that is capable of serializing any express query into a mongoose query.

### 1.1 How to use it
The expected format is:
`http://api.com?criteria=<json_formatted_criteria>`

```json
{
    "criteria": {
        "where": {},
        "limit": 0,
        "offset": 0,
        "sort": {},
        "includes": []
    }
}
```

##### where parameter

!!! tip
    use `where` parameter to filter the result of the resource requested.

```json
{
    "criteria": {
      "where": {
        "something": "equals something else"
      }
    }
}
```

##### sort parameter

!!! tip
    use `sort` to sort the results, it must be an object,  

```json
{
    "criteria": {
      "sort": {
        "some.property": -1
      }
    }
}
```

##### limit parameter

!!! tip
    use `limit` to limit the number of results, it must be an integer between 0 and +∞

```json
{
    "criteria": {
      "limit": 10
    }
}
```


##### offset parameter

!!! tip
    use `offset` to skip a number of entries from the results, it must be an integer between 0 and +∞

```json
{
    "criteria": {
      "offset": 10
    }
}
```

##### includes parameter

!!! tip
    use `includes` to populate relations of results. **it must be an array**

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


### 2. Use your own CriteriaBuilder
There is two options to replace the default CriteriaBuilder bundled with Idylle.

#### 2.1 Overriding the default
You can override the default CriteriaBuilder at the dependencies initialization :

```javascript
const Core = require('idylle').Core;
const app = new Core();

class CustomCriteriaBuilder {
  constructor() {}

  default() {
    return {foo: 'bar'};
  }

  build(query) {
    return this.default();
  }
}

Core.on(Core.events.init.dependencies, () => {
  return {
    critieriaBuilder: CustomCriteriaBuilder
    ...
  }
});
```

!!! warning "Mandatory methods"
    Please be careful to implement the `default()` and `build()` methods.
    All action will have a context where the criteria property will come from the build method when called from an HTTP request.   
    And when one of your action will use another action, the default criteria will be merged to the context passed to the invoked action.


#### 2.2 Override per Action

When building an action we have seen a simple way to do it:
```javascript
return Action({
  execute: context => {
      // ....
  }
});
```
Here the only mandatory property has been the `execute` property. You can also add a `criteriaBuilder` property. This property will be used only for the targeted action.

```javascript
return Action({
  criteriaBuilder: {
      default: () => {foo: 'bar'},
      build: (query) => {foo: query['bar']}  
  },
  execute: context => {
      // ....
  }
});
```


## 2. ErrorHandler

The `ErrorHandler` is in charge of responding to clients when an error occurs. Generally you want to hide this error in production but need the stack trace in developpement.

That is what the default ErrorHandler does on Idylle.
Here the code :

```javascript
module.exports = (error, req, res, next) => {
    const details = reason(error);
    console.error(details);

    if (error.code)
        return res.status(error.code).send(details);

    if (process.env.NODE_ENV !== 'production') {
        return res.status(500).send(details);
    }

    return res.status(500).send();
};

function reason(error) {
    return error.stack ? error.stack : error.reason ? error.reason : typeof error === 'object' ? JSON.stringify(error) : error.toString()
}
```


### 2.1 Overriding the ErrorHandler
You can develop and plug your own error handler.

On the dependency initialization events: `Core.events.init.dependencies` you can override the `ErrorHandler`.

Let's say you want to modify the behavior of the ErrorHandler to return an error 500 and use the property `message` of your errors.

```javascript
const Core = require('idylle').Core;
const app = new Core();

app.on(Core.events.init.dependencies, () => {
  return {
    errorHandler: (error, req, res, next) =>  {
        return res.status(500).send(error.message);
    }
  };
});
...
```

## 3. ResponseHandler
The `ResponseHandler` is used behind the scene the respond to HTTP request. It analyzes the state of the context and the data returned by an action to decide what HTTP code to use and what data to send in the request's body.

Here the default `ResponseHandler` provided by Idylle: 

```javascript
module.exports = (req, res, context, result) => {
    if (!context || !context.meta)
        return res.send(result);

    if (context.meta.state === 'noContent')
        return res.status(204).send();

    if (context.meta.state === 'partial')
        return res.status(206).send(result);

    if (context.meta.state === 'stream')
        return res.download(context.meta.path);

    if (context.meta.state === 'redirect') {
        const code = context.meta.code || 302;
        return res.status(code).send(context.meta.url);
    }

    if (context.meta.state === 'created') {
        if (context.meta.resourceURI)
            res.header('location', context.meta.resourceURI);

        return res.status(201).send();
    }

    return res.send(result);
};
```

As you can see, nothing magical happens here. You can change the context state by calling methods like `context.created(resource)`, or `context.noContent()` to update context's state. Then, once the action resolve the promise, depending on the state, the default `ResponseHandler` will use the data to respond to the HTTP request.

### 3.1 Overriding the ResponseHandler
You can develop and plug your own response handler.

On the dependency initialization events: `Core.events.init.dependencies` you can override the `ResponseHandler`.

```javascript
const Core = require('idylle').Core;
const app = new Core();

app.on(Core.events.init.dependencies, () => {
  return {
    responseHandler:  (req, res, context, result) => {
        return res.send(result);
    }
  };
});
...
```