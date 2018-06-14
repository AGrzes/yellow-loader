
const _ = require('lodash')
class Loader {
  constructor(options){
    this.options = options
  }
  add(rule){
    _.assign(rule,this.options)
  }
}
module.exports.Loader = Loader
