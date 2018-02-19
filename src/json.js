const rx = require('rxjs')
const fs = require('fs')
const _ = require('lodash')
const readFile = rx.Observable.bindNodeCallback(fs.readFile)

function load(source) {
  return source.filter((entry) => /.*\.json/.test(entry.fileName)).mergeMap((entry) =>
    readFile(entry.path).mergeMap((contents) => {
      try {
      const json = JSON.parse(contents)
      if (_.isArray(json)) {
        return rx.Observable.of(..._.map(json, (document) => Object.assign(document, {
          $metadata: entry
        })))
      } else {
        return rx.Observable.of(Object.assign(json, {
          $metadata: entry
        }))
      }
    } catch (e){
      console.error(entry.path)
      console.error(e)
      return rx.Observable.empty()
    }
    })
  )
}

function serialize(source){
  return source.map(JSON.stringify)
}

module.exports.load = load
module.exports.serialize = serialize
