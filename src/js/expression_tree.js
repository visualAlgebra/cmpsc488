
const Orientation = {
  horizontal: 0,
  vertical: 1
}

// Abstract Class
class ExpressionTree {
  constructor(kind) {
    this.kind = kind;
  }
}

// Abstract Class
class Tag extends ExpressionTree {
  constructor(orientation) {
    super("tag");
    this.orientation = orientation;
  }
}

class Horizontal extends Tag {
  constructor(east, west) {
    super(Orientation.horizontal);
    this.east = east;
    this.west = west;
  }
}

class Vertical extends Tag {
  constructor(north, south) {
    super(Orientation.vertical);
    this.north = north;
    this.south = south;
  }
}

class Variable extends ExpressionTree {
  constructor(id) {
    super("variable");
    this.id = id;
  }
}

class Literal extends ExpressionTree {
  constructor(value) {
    super("literal");
    this.value = value;
  }
}

////////////////////////////////////////////////////////////////////////////////

// x4 + 0 - 2 - x1
let e1 = new Horizontal(
  [new Variable(4), new Literal(0)],
  [new Literal(2), new Variable(1)]
);

// (2 * x1) + x2
let e2 = new Horizontal([
    new Vertical([new Literal(2), new Variable(1)], []),
    new Variable(2)
  ],
  []
);
