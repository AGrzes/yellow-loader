const parameters = require('yargs')
  .command('$0 [baseDirectory] [targetFile]', 'load', (yargs) => {
    yargs.positional('baseDirectory',{default:'.'})
    .positional('targetFile',{default:'model.json'})
  })
  .argv
console.log(parameters)
