const _  = require('lodash')

function isRelation(attribute){
  return _.startsWith(attribute,'@')
}

function split(source,keyFunction,sink){
  return source.map((entity)=>{
    return _.mapValues(entity,(value,key)=>{
      if (isRelation(key)){
        sink(value)
        return keyFunction(value)
      } else {
        return value
      }
    })
  })
}

module.exports = split
