# Example 
```javascript
const yellow = require('yellow').use(parser.json).use(parser.yaml).use(source.file)
const source = yellow.loader().file()
const extract = yellow.extract().split(splitter.array)
const persist = require('ouch-rx').sink('<couchdb url>')
persist.subscribe(extract)
extract.subscribe(source)
source.scan()

```
# API
## Yellow Object
Yellow module is an entry point to yellow API

### `use(plugin)`
Use method registers plugin with yellow object. 
It will register associated extensions to Yellow object API.

