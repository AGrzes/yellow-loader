
const _ = require('lodash')
const rx = require('rxjs')
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
    return rx.merge(..._.map(this.rules,(rule)=>rule.scan()))
  }
}
module.exports.Loader = Loader
