
const _  = require('lodash')
function keyFromLabel(label){
  return _.kebabCase(label)
}

function keyFromEntity(entity,labelFunction){
  if (entity.$key){
    return entity.$key
  } else if (entity.key){
    return entity.key
  } else if (entity.id){
    return entity.id
  } else if (labelFunction) {
    const label = labelFunction(entity)
    if (label){
      return keyFromLabel(label)
    }
  }
}

function set(source,labelFunction){
  return source.map((entity)=>{
    entity.$key = keyFromEntity(entity,labelFunction)
    return entity
  })
}

module.exports.set = set
module.exports.keyFromEntity = keyFromEntity
