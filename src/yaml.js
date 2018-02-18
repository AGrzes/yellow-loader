const rx = require('rxjs')
const fs = require('fs')
const _ = require('lodash')
const YAML = require('js-yaml')
const readFile = rx.Observable.bindNodeCallback(fs.readFile)

function load(source) {
  return source.filter((entry) => /.*\.yaml/.test(entry.fileName)).mergeMap((entry) =>
    readFile(entry.path).mergeMap((contents) => {
      let yaml
      if (_.startsWith(contents,'---')){
        yaml = YAML.safeLoadAll(contents)
      } else {
        yaml = YAML.safeLoad(contents)
      }
      
      if (_.isArray(yaml)) {
        return rx.Observable.of(..._.map(yaml, (document) => Object.assign(document, {
          $metadata: entry
        })))
      } else {
        return rx.Observable.of(Object.assign(yaml, {
          $metadata: entry
        }))
      }
    })
  )
}

module.exports.load = load
