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
    this.source = new Source(this)
  }
  use(plugin){

  }
  scan(target){

  }
}

class Builder {
  build(){
    return new Loader()
  }
}

module.exports.loader =  function loader(){
  return new Loader()
}

module.exports.builder = () => new Builder()

module.exports.parser = {
  
}

module.exports.source = {
  
}

module.exports.Loader = Loader
