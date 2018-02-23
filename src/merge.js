const _  = require('lodash')

function merge(source){
  const model = {}
  return source.map((entry)=>{
    if (model[entry.$key]){
      _.mergeWith(model[entry.$key],entry,(targetValue,sourceValue,key)=>{
        if (_.startsWith(key,'$')){
          return targetValue || sourceValue
        } else {
          if (targetValue && sourceValue){
            if (_.isArray(targetValue)){
              if (_.isArray(sourceValue)){
                return [...targetValue,...sourceValue]
              } else {
                return [...targetValue,sourceValue]
              }
            } else if (_.isArray(sourceValue)){
              return [targetValue,...sourceValue]
            } else {
              return [targetValue,sourceValue]
            }
          } else {
            return targetValue || sourceValue
          }
        }
      })
    } else {
      model[entry.$key] = entry
    }
    return _.values(model)
  })
}

module.exports = merge
