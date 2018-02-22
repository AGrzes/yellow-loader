const _  = require('lodash')

function isRelation(attribute){
  return _.startsWith(attribute,'@')
}

function split(source,keyFunction,sink){
  return source.map((entity)=>{
    return _.mapValues(entity,(value,key)=>{
      if (isRelation(key)){
        if (_.isString(value)){
          value = {
            $metadata:{
              generated:true
            },
            $label:value
          }
        }
        if (entity.$metadata){
          value.$metadata =_.assign({},_.clone(entity.$metadata),value.$metadata) 
        }
        sink(value)
        return keyFunction(value)
      } else {
        return value
      }
    })
  })
}

module.exports = split
