#!/usr/bin/env node
const main = require('./main')
const rx = require('rxjs')
const parameters = require('yargs')
  .command('$0 [baseDirectory] [targetFile]', 'load', (yargs) => {
    yargs.positional('baseDirectory',{default:'.'})
    .positional('targetFile',{default:'model.json'})
  })
  .argv
main(parameters.baseDirectory,parameters.targetFile).subscribe(()=>console.log('done'))
