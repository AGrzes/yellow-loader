const rx = require('rxjs')
const fs = require('fs')
const readFile = rx.Observable.bindNodeCallback(fs.readFile)

function load(source) {
  return source.filter((entry) => /.*\.json/.test(entry.fileName)).mergeMap((entry) =>
    readFile(entry.path).map((contents) => Object.assign(JSON.parse(contents), {
      $metadata: entry
    }))
  )
}

module.exports.load = load
