class LoadRule {
  extract(extractFunction){

  }
}

class Source {
  file(glob){
    return new LoadRule()
  }
  dir(glob){
    return new LoadRule()
  }
}


class Loader {
  constructor(){
    this.source = new Source()
  }
  use(plugin){

  }
  scan(target){
    
  }
}

module.exports.loader =  function loader(){
  return new Loader()
}

module.exports.parser = {
  
}

module.exports.source = {
  
}
