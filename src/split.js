const _  = require('lodash')
const rx = require('rxjs')
function isRelation(attribute){
  return _.startsWith(attribute,'@')
}

function splitEntity(entity,keyFunction){
    const result=[]
    result.push(_.mapValues(entity,(value,key)=>{
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
        result.push(splitEntity(value,keyFunction))
        return keyFunction(value)
      } else {
        return value
      }
    }))
    return _.flatten(result)
}

function split(source,keyFunction){
  return source.mergeMap((entity)=>{
    return rx.Observable.of(...splitEntity(entity,keyFunction))
  })
}

module.exports = split
