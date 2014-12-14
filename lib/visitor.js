var recast = require('recast');
var types = recast.types;
var b = recast.types.builders;
var n = recast.types.namedTypes;

function Visitor() {
  types.PathVisitor.call(this);
}
Visitor.prototype = Object.create(types.PathVisitor.prototype);
Visitor.prototype.constructor = Visitor;

Visitor.prototype.visitProperty = function(prop) {
  if (n.ObjectExpression.check(prop.parent.node)) {
    if (prop.node.shorthand) {
      prop.node.shorthand = false;
    }
  }

  this.traverse(prop);
};

Visitor.visit = new Visitor();

module.exports = Visitor;

