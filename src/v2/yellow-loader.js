
const _ = require('lodash')
class Loader {
  constructor(options){
    this.options = options
    this.rules = []
  }
  add(rule){
    _.assign(rule,this.options)
    this.rules.push(rule)
  }
  scan(){
    _.forEach(this.rules,(rule)=>rule.scan())
  }
}
module.exports.Loader = Loader
