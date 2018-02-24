const _  = require('lodash')

function mergeValues(targetValue,sourceValue){
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
function isGenerated(entry){
  return entry.$metadata && entry.$metadata.generated
}

function merge(source){
  const model = {}
  return source.map((entry)=>{
    const existing = model[entry.$key]
    if (existing){
      if (isGenerated(existing) == isGenerated(entry)) {
        _.mergeWith(existing, entry, (targetValue, sourceValue, key) => {
          if (_.startsWith(key, '$')) {
            return targetValue || sourceValue
          } else {
            return mergeValues(targetValue, sourceValue)
          }
        })
      } else if (isGenerated(existing)) {
        model[entry.$key] = entry
      }
      } else {
      model[entry.$key] = entry
    }
    return _.values(model)
  })
}

module.exports = merge
