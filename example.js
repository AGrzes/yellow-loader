const yellowLoader = require('./src/v2/yellow-loader')
const loader = yellowLoader.loader()
//loader.use(yellowLoader.parser.json)
//loader.use(yellowLoader.parser.yaml)
//loader.use(yellowLoader.source.file)
loader.source.file('changelog/**/metadata.yaml').extract((metadata,content,extract)=>{
  extract('changelog:'+metadata.path(-1),Object.extend({$type:'changelog'},content))
})
loader.source.file('changelog/**/changes.md').extract((metadata,content,extract)=>{
  extract('changelog:'+metadata.path(-1),{changes:content})
})

loader.source.file('organization/**/metadata.yaml').extract((metadata,content,extract)=>{
  extract('organization:'+metadata.path(-1),Object.extend({$type:'organization'},content))
})

loader.source.file('session/*/metadata.yaml').extract((metadata,content,extract)=>{
  extract('session:'+metadata.path(-1),Object.extend({$type:'session'},content))
})
loader.source.file('session/*/events.md').extract((metadata,content,extract)=>{
  extract('session:'+metadata.path(-1),{events:content})
})

loader.source.file('reference/**/metadata.yaml').extract((metadata,content,extract)=>{
  extract(metadata.path(-1),Object.extend({$type:metadata.path(-1).split(':')[0],parent:metadata.path(-2)},content))
})
loader.source.file('reference/**/content.md').extract((metadata,content,extract)=>{
  extract(metadata.path(-1),{content:content})
})

loader.source.file('geo/**/*').extract((metadata,content,extract)=>{
  const parent = metadata.path(-2)
  if (_.isArray(content)){
    const type = metadata.basename.split(':')[0]
    _.forEach(content,(item)=>{
      const key = type+":"+_.kebabCase(item.name)
      extract(key,Object.extend({$type:type,parent},item))
      extract(parent,{children:[key]})
    })
  } else {
    const type = metadata.basename.split(':')[0]
    const name = item.name || metadata.basename.split(':')[1]
    const key = type+":"+_.kebabCase(name)
    extract(key,Object.extend({$type:type,name,parent},content))
    extract(parent,{children:[key]})
  }
})
loader.source.dir('geo/**').extract((metadata,content,extract)=>{
  const parent = metadata.path(-1)
  const type = metadata.basename.split(':')[0]
  const name = metadata.basename.split(':')[1]
  const key = type+":"+_.kebabCase(name)
  extract(key,Object.extend({$type:type,name,parent},content))
  extract(parent,{children:[key]})
})

//const persist = require('ouch-rx').sink('<couchdb url>')
//loader.scan(persist)
loader.scan(console.log)
