const rx = require('rxjs')
const {filter,mergeMap,map} = require('rxjs/operators')
const fs = require('fs')
const _ = require('lodash')
const readFile = rx.bindNodeCallback(fs.readFile)

function load(source) {
  return source.pipe(filter((entry) => /.*\.json/.test(entry.fileName)),mergeMap((entry) =>
    readFile(entry.path).pipe(mergeMap((contents) => {
      try {
      const json = JSON.parse(contents)
      if (_.isArray(json)) {
        return rx.of(..._.map(json, (document) => Object.assign(document, {
          $metadata: entry
        })))
      } else {
        return rx.of(Object.assign(json, {
          $metadata: entry
        }))
      }
    } catch (e){
      console.error(entry.path)
      console.error(e)
      return rx.empty()
    }
    }))
  ))
}

function serialize(source){
  return source.pipe(map(JSON.stringify))
}

module.exports.load = load
module.exports.serialize = serialize
