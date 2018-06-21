const _  = require('lodash')
const rx = require('rxjs')
const {mergeMap} = require('rxjs/operators')
function isRelation(attribute){
  return _.startsWith(attribute,'@')
}

function splitEntity(entity,keyFunction){
    const result=[]
    result.push(_.mapValues(entity,(value,key)=>{
      if (isRelation(key)){
        if (_.isArray(value)){
          return _.map(value,(item)=>{
            if (_.isString(item)){
              item = {
                $metadata:{
                  generated:true
                },
                $label:item
              }
            }
            if (entity.$metadata){
              item.$metadata =_.assign({},_.clone(entity.$metadata),item.$metadata) 
            }
            result.push(splitEntity(item,keyFunction))
            return keyFunction(item)
          })
        }
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
  return source.pipe(mergeMap((entity)=>{
    return rx.of(...splitEntity(entity,keyFunction))
  }))
}

module.exports = split
