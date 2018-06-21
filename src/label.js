
const _  = require('lodash')
const {map} = require('rxjs/operators')
function labelFromKey(key){
  return _.startCase(key)
}

function labelFromEntity(entity,keyFunction){
  if (entity.$label){
    return entity.$label
  } else if (entity.label){
    return entity.label
  } else if (entity.name){
    return entity.name
  } else if (keyFunction) {
    const key = keyFunction(entity)
    if (key){
      return labelFromKey(key)
    }
  }
}

function set(source,keyFunction){
  return source.pipe(map((entity)=>{
    entity.$label = labelFromEntity(entity,keyFunction)
    return entity
  }))
}

module.exports.set = set
module.exports.labelFromEntity = labelFromEntity
