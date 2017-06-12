# Architecture
Idylle is a micro-framework on top of express (so far).

## Life cycle
![Screenshot](../assets/architecture-life-cycle.png)


## Project layout
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
