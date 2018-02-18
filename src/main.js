const scan = require('./scan')
const json = require('./json')
const yaml = require('./yaml')
const key = require('./key')
const label = require('./label')
const rx = require('rxjs')
const fs = require('fs')
const writeFile = rx.Observable.bindNodeCallback(fs.writeFile)
function load(basePath,target){
  const files = scan(basePath)
  const loaded = rx.Observable.merge(json.load(files),yaml.load(files))
  const withKey = key.set(loaded,label.labelFromEntity)
  const withLabel = label.set(withKey,key.keyFromEntity)
  const serialized = json.serialize(withLabel.toArray())

  return serialized.mergeMap((content)=>writeFile(target,content,'UTF-8'))
}
module.exports = load
