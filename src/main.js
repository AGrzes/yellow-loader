const scan = require('./scan')
const json = require('./json')
const yaml = require('./yaml')
const key = require('./key')
const label = require('./label')
const split = require('./split')
const merge = require('./merge')
const rx = require('rxjs')
const fs = require('fs')
const _ = require('lodash')
const writeFile = rx.Observable.bindNodeCallback(fs.writeFile)
function load(basePath,target){
  const files = scan(basePath)
  const loaded = rx.Observable.merge(json.load(files),yaml.load(files))
  const relationsSplit = split(loaded,_.partial(key.keyFromEntity,_,label.labelFromEntity)) 
  const withKey = key.set(relationsSplit,label.labelFromEntity)
  const withLabel = label.set(withKey,key.keyFromEntity)
  const merged = merge(withLabel)
  const serialized = json.serialize(merged.last())

  return serialized.mergeMap((content)=>writeFile(target,content,'UTF-8'))
}
module.exports = load
