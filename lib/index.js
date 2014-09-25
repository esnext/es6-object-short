var esprima = require('esprima-fb');
var recast = require('recast');
var through = require('through');
var b = recast.types.builders;
var n = recast.types.namedTypes;

var ES6ObjectShort = recast.Visitor.extend({
  visitProperty: function(expr) {
    if (expr.shorthand) {
      expr.shorthand = false;
    }

    this.genericVisit(expr);

    return expr;
  }
});

function transform(ast) {
  (new ES6ObjectShort()).visit(ast);
  return ast;
}

function compile(code, options) {
  options = options || {};

  var recastOptions = {
    esprima: esprima,
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
