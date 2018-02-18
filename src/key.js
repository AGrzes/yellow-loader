
function set(source){
  return source.map((entry)=>{
    entry.$key = entry.$key || entry.key
    return entry
  })
}

module.exports.set = set
