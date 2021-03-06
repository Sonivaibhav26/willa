const { mixin } = require('../utils'),
      { Base, Soureceable } = require('../protocols');

class SourceBuilder {
  constructor(baseClass) {
    this.baseClass = baseClass;
  }

  // default class builder
  _build() {
    return mixin(this.baseClass).with(Base, Soureceable);
  }

  // build method must be implemented in the concrete builder
  build(app) {
    throw Error('Build method required');
  }

  // build method can optionally be implemented in a 
  // concrete builder, which supports commitable protocol
  buildCommit(app) {
    let klass =  this.constructor.name;
    process.emitWarning('Build method required', { 
      detail: `${klass} doesn't implemented buildCommit() method. Falling back to default build() method`
    });
    return this.build();
  }

  downstream() {
    throw Error('Downstream not specified')
  }

  name() {
    throw Error('Source should be have unique name');
  }
  
  commit(...param) {
    let klass =  this.constructor.name;
    process.emitWarning('Commit method required', { 
      detail: `${klass} doesn't implemented commit() method.`
    });
  }

  write(...param) {
    process.emitWarning('Write method required', { 
      detail: `${klass} doesn't implement writable.`
    });
  }
}

module.exports = SourceBuilder;