var recast = require('recast');
var types = recast.types;
var b = recast.types.builders;
var n = recast.types.namedTypes;
var through = require('through');
var Visitor = require('./visitor');

function transform(ast) {
  return types.visit(ast, Visitor.visit);
}

function compile(code, options) {
  options = options || {};

  var recastOptions = {
    sourceFileName: options.sourceFileName,
    sourceMapName: options.sourceMapName
  };

  var ast = recast.parse(code, recastOptions);
  return recast.print(transform(ast), recastOptions);
}

module.exports = function () {
  var data = '';

  function write(buf) {
    data += buf;
  }

  function end() {
    this.queue(compile(data).code);
    this.queue(null);
  }

  return through(write, end);
};

module.exports.transform = transform;
module.exports.compile = compile;
