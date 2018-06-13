const vfs = require('vinyl-fs')
const rx = require('rxjs')
const streamToRx = require('rxjs-stream').streamToRx
const path = require('path')
const mime = require('mime')
const YAML = require('js-yaml')
const _ = require('lodash')
const parsers = {
  'application/json': (text)=>JSON.parse(text),
  'text/yaml': (text)=>YAML.load(text)
}

class FileSource {
  constructor(globs,extract = {},options = {}){
    if (!_.isFunction(extract)){
      options = extract
      extract = ({content,vfile})=>({
        type: 'data',
        source:{
          plugin: 'FileSource',
          path:this.base ? path.relative(this.base, vfile.path): vfile.path,
          name:vfile.basename
        },
        content
      })
    }

    const {base}= options
    this.globs = globs
    this.base = base
    this.extract = extract
  }
  scan(){
    return streamToRx(vfs.src(this.globs,{cwd:this.base,nodir:true})).map((vfile)=>({
      content:parsers[mime.getType(vfile.basename)]?parsers[mime.getType(vfile.basename)](vfile.contents):vfile.contents,
      vfile
    })).map(this.extract)
  }
}

module.exports.FileSource = FileSource
