const vfs = require('vinyl-fs')
const rx = require('rxjs')
const streamToRx = require('rxjs-stream').streamToRx
const path = require('path')
const mime = require('mime')
const YAML = require('js-yaml')
const _ = require('lodash')
const {map,flatMap} = require('rxjs/operators')
const parsers = {
  'application/json': (text)=>JSON.parse(text),
  'text/yaml': (text)=>{
    if (/(^|\n)---($|\n)/.test(text)){
      return YAML.loadAll(text)
    } else {
      return YAML.load(text)
    }
  }
}

class FileSource {
  constructor(globs,extract = {},options = {}){
    if (!_.isFunction(extract)){
      options = extract
      extract = ({content})=>content
    }

    const {base,project,rule}= options
    this.globs = globs
    this.base = base
    this.extract = extract
    this.project = project
    this.rule = rule
  }
  scan(){
    return streamToRx(vfs.src(this.globs,{cwd:this.base,nodir:true})).pipe(map((vfile)=>({
      content:parsers[mime.getType(vfile.basename)]?parsers[mime.getType(vfile.basename)](vfile.contents):vfile.contents.toString('UTF-8'),
      vfile
    })),flatMap(({content,vfile})=>{
      const data = this.extract({content,vfile})
      const location = this.base ? path.relative(this.base, vfile.path): vfile.path
      if (_.isArray(data)){
        return rx.of(..._.map(data,(item,index)=>({
          type: 'data',
          source:{
            plugin: 'FileSource',
            project: this.project,
            rule: this.rule,
            location:`${location}#${index}`,
            name:vfile.basename
          },
          data:item
        })))
      } else {
        return rx.of({
          type: 'data',
          source:{
            plugin: 'FileSource',
            project: this.project,
            rule: this.rule,
            location:location,
            name:vfile.basename
          },
          data
        })
      }
    }))
  }
}

module.exports.FileSource = FileSource
