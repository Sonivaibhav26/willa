const { ProducerStream } = require('kafka-node'),
  { Writable } = require('stream'),
  { Builder } = require('../../builder'),
  _ = require('lodash');
  $ =  require('steeltoe');

class Producer extends Builder.Sink {
  constructor(lambda) {
    super(Writable);
    this._lambda = lambda;
  }

  build(transaction, app) {
    const Klass = this._build();
    const trans =  this;
    this._writeStream = new Klass({
      objectMode: true,
      write(message, encoding, callback) {
        if(! _.isEmpty(message.error) ) {
          return callback();
        }
        trans._lambda(message.data, message.error, function(data, error=null) {
          if( _.isEmpty(error)){
            if(!_.isEmpty(transaction)) {
              transaction.commit(message.message);
            }
            callback();
          }
        });
      }
    }); 
  }

  upstream() {
    if(this._writeStream === undefined) {
      throw Error('Upstream is undefined');
    }
    return this._writeStream;
  }
}

module.exports = (options) => {
  return new Producer(options);
}
