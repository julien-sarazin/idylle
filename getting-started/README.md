---
description: This section will help you to start working with Idylle.
---

# Getting Started



{% tabs %}
{% tab title="The Quick way" %}
#### 1. Install the CLI

```bash
npm install -g idylle-cli
```

#### 2. Setting up your project

```bash
idylle new sample
cd sample
npm i
```

#### 3. Start the project

```bash
npm start
```
{% endtab %}

{% tab title="Starting from the bottom" %}
#### 1. Initialise your workspace

```bash
npm init
npm install --save idylle
```

2. Create your first file `index.js` 

```bash
touch index.js
```

3. Write the minimum required

```javascript
const Core = require('idylle').Core;
const app = new Core();

app.start();
```

By default the server's listens on all interfaces `0.0.0.0` on port `8080`. If you check in your browser at `localhost:8000` you should the the famous express's error handling `cannot GET /`.  
The default HTTP router comes from [Express](http://expressjs.com/fr/4x/api.html#router).
{% endtab %}
{% endtabs %}

