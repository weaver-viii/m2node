// Generated by CoffeeScript 1.3.3
(function() {
  var Handler, MongrelRequest, events, zeromq,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  events = require('events');

  zeromq = require('zmq');

  MongrelRequest = require('./mongrel_request').MongrelRequest;

  Handler = (function(_super) {

    __extends(Handler, _super);

    function Handler(options) {
      var _this = this;
      this.pullSocket = zeromq.createSocket('pull');
      this.pullSocket.connect(options.recv_spec);
      this.pullSocket.on('message', function(message) {
        return _this.emit('request', new MongrelRequest(message));
      });
      this.pubSocket = zeromq.createSocket('pub');
      this.pubSocket.connect(options.send_spec);
    }

    Handler.prototype.sendResponse = function(request, response) {
      var header, outBuffer;
      header = [request.uuid, ' ', request.connectionId.length, ':', request.connectionId, ', '].join('');
      outBuffer = new Buffer(header.length + response.length);
      outBuffer.write(header, 'ascii');
      response.copy(outBuffer, header.length);
      return this.pubSocket.send(outBuffer);
    };

    return Handler;

  })(events.EventEmitter);

  exports.Handler = Handler;

}).call(this);
