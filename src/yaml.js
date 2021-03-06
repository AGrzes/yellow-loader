const rx = require('rxjs')
const {filter,mergeMap} = require('rxjs/operators')
const fs = require('fs')
const _ = require('lodash')
const YAML = require('js-yaml')
const readFile = rx.bindNodeCallback(fs.readFile)

function load(source) {
  return source.pipe(filter((entry) => /.*\.yaml/.test(entry.fileName)),mergeMap((entry) =>
    readFile(entry.path).pipe(mergeMap((contents) => {
      let yaml
      if (_.startsWith(contents,'---')){
        yaml = YAML.safeLoadAll(contents)
      } else {
        yaml = YAML.safeLoad(contents)
      }
      
      if (_.isArray(yaml)) {
        return rx.of(..._.map(yaml, (document) => Object.assign(document, {
          $metadata: entry
        })))
      } else {
        return rx.of(Object.assign(yaml, {
          $metadata: entry
        }))
      }
    }))
  ))
}

module.exports.load = load
