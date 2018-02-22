const _  = require('lodash')
function merge(source){
  const model = {}
  return source.map((entry)=>{
    model[entry.$key] = entry
    return _.values(model)
  })
}

module.exports = merge
