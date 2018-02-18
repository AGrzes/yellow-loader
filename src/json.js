const rx = require('rxjs')
const fs = require('fs')
const _ = require('lodash')
const readFile = rx.Observable.bindNodeCallback(fs.readFile)

function load(source) {
  return source.filter((entry) => /.*\.json/.test(entry.fileName)).mergeMap((entry) =>
    readFile(entry.path).mergeMap((contents) => {
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
    })
  )
}

module.exports.load = load
