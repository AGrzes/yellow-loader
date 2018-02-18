const scan = require('./scan')
const json = require('./json')
const yaml = require('./yaml')
const key = require('./key')
const label = require('./label')
const rx = require('rxjs')
function load(basePath){
  const files = scan(basePath)
  const loaded = rx.Observable.merge(json.load(files),yaml.load(files))
  const withKey = key.set(loaded,label.labelFromEntity)
  const withLabel = label.set(withKey,key.keyFromEntity)
  return withLabel.toArray()
}
module.exports = load
