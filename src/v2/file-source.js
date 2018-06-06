const vfs = require('vinyl-fs')
const rx = require('rxjs')
const streamToRx = require('rxjs-stream').streamToRx
const path = require('path')
const mime = require('mime')

const parsers = {
  'application/json': (text)=>JSON.parse(text)
}

class FileSource {
  constructor(globs,{base}={}){
    this.globs = globs
    this.base = base
  }
  scan(){
    return streamToRx(vfs.src(this.globs,{cwd:this.base,nodir:true})).map((vfile)=>({
      path:this.base ? path.relative(this.base, vfile.path): vfile.path,
      name:vfile.basename,
      content: parsers[mime.getType(vfile.basename)]?parsers[mime.getType(vfile.basename)](vfile.contents):vfile.contents
    }))
  }
}

module.exports.FileSource = FileSource
