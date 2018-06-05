const vfs = require('vinyl-fs')
const rx = require('rxjs')
const streamToRx = require('rxjs-stream').streamToRx
class FileSource {
  constructor(globs,{base}={}){
    this.globs = globs
    this.base = base
  }
  scan(){
    return streamToRx(vfs.src(this.globs,{base:this.base})).map((vfile)=>({
      path:vfile.path,
      name:vfile.basename
    }))
  }
}

module.exports.FileSource = FileSource
