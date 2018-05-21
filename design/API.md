# Example 
```javascript
const yellow = require('yellow').use(parser.json).use(parser.yaml).use(source.file)
yellow.key(attribute('$type').separator(':').attribute('name').snakeCase())
const changelog = yellow.loader().file('changelog').attribute('$type',value('changelog')).attribute('name',path(0))
const extract = yellow.extract()
const persist = require('ouch-rx').sink('<couchdb url>')
persist.subscribe(extract)
extract.subscribe(changelog)
source.scan()

```
# API
## Yellow Object
Yellow module is an entry point to yellow API

### `use(plugin)`
Use method registers plugin with yellow object. 
It will register associated extensions to Yellow object API.

