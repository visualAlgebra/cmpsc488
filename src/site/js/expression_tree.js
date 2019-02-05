
const Orientation = {
  EW: "eastwest",
  NS: "northsouth"
}

// Abstract Class
class ExpressionTree {
  constructor(kind) {
    this.kind = kind;
    this.treeCount = 1;
    this.parent = null;
  }

  equals(that) {
    if (Object.is(this, that)) return true;
    if (this.kind !== that.kind) return false;
  }
}

class Tag extends ExpressionTree {
  constructor(orientation, nw, se) {
    super("tag");
    this.orientation = orientation;
    this.NW = nw || [];
    this.SE = se || [];

    for (let child of this.NW) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
    for (let child of this.SE) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
  }

  updateParentTreeCount(count) {
    this.treeCount += count;
    if (this.parent != null) {
      this.parent.updateParentTreeCount(1);
    }
  }
  //
  addSouthEast(child) {
    this.SE.push(child);
    child.parent = this;
    this.updateParentTreeCount(1);
  }

  addNorthWest(child) {
    this.NW.push(child);
    child.parent = this;
    this.updateParentTreeCount(1);
  }

  equals(that) {
    //if (super.equals(that)) return true;

    if (that.kind === "tag") {
      if (this.orientation !== that.orientation
       || this.NW.length !== that.NW.length
       || this.SE.length !== that.SE.length) {
         return false;
      }

      for (let i = 0; i < this.NW.length; i++) {
        if (!this.NW[i].equals(that.NW[i])) return false;
      }

      for (let i = 0; i < this.SE.length; i++) {
        if (!this.SE[i].equals(that.SE[i])) return false;
      }

      return true;
    }else{
      return false;
    }
  }

  delete(ref) {
    array_delete(this.SE, ref);
    array_delete(this.NW, ref);
  }

  /** 
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render(p) {
    p.push();
    switch (this.orientation) {
      case Orientation.EW:
        this.NW.forEach((child, i) => {
          p.push();
          p.translate(-i * (100 + 10) - 50, 0);
          child.render(p);
          p.pop();
        });
        this.SE.forEach((child, i) => {
          p.push();
          p.translate(i * (100 + 10) + 50, 0);
          child.render(p);
          p.pop();
        });
        break;

      case Orientation.NS:
        this.NW.forEach((child, i) => {
          p.push();
          p.translate(0, -i * (100 + 10) - 50);
          child.render(p);
          p.pop();
        });
        this.SE.forEach((child, i) => {
          p.push();
          p.translate(0, i * (100 + 10) + 50);
          child.render(p);
          p.pop();
        });
        break;
    
      default:
        break;
    }
    p.pop();
  }
}

function array_delete(arr, ref) {
  for (let i = 0; i < arr.length; i++) {
    if (Object.is(ref, arr[i])) {
      arr.splice(i, 1);
    }
  }
}
class Variable extends ExpressionTree {
  constructor(value) {
    super("variable");
    this.value = value;
  }

  equals(that) {
    //if (super.equals(that)) return true;
    if(that.kind!=="variable") return false;
    return this.value === that.value;
  }

  /** 
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render(p) {
    p.noStroke();
    p.fill(200, 0, 200);
    p.ellipse(0, 0, 50, 50);
    p.fill(255);
    p.textSize(30);
    p.text(`x${this.value}`, -15, 15);
  }
}

class Literal extends ExpressionTree {
  constructor(value) {
    super("literal");
    this.value = value;
  }

  equals(that) {
    //if (super.equals(that)) return true;
    if(that.kind!=="literal") return false;
    return this.value === that.value;
  }

  /** 
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render(p) {
    p.noStroke();
    p.fill(0, 200, 100);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 50, 50);
    p.fill(255);
    p.textSize(30);
    p.text(this.value, -15, 15);
  }
}

////////////////////////////////////////////////////////////////////////////////

function assert(left, right) {
  if (left !== right) throw "Bad assertion!";
}

// x4 + 0 - 2 - x1
let e1 = new Tag(Orientation.EW,
  [new Variable(4), new Literal(0)],
  [new Literal(2), new Variable(1)]
);

// (2 * x1) + x2
let e2 = new Tag(Orientation.EW,[
    new Tag(Orientation.NS,[new Literal(2), new Variable(1)], []),
    new Variable(2)
  ],
  []
);


let e3=new Tag(Orientation.EW,[new Literal(2),new Variable(3)]);

let h3=new Tag(Orientation.EW);
h3.addNorthWest(new Literal(2));
h3.addNorthWest(new Variable(3));

let h1 = new Tag(Orientation.EW);
h1.addNorthWest(new Variable(4));
h1.addNorthWest(new Literal(0));
h1.addSouthEast(new Literal(2));
h1.addSouthEast(new Variable(1));

let h2 = new Tag(Orientation.EW);
let v = new Tag(Orientation.NS);
h2.addNorthWest(v)
v.addNorthWest(new Literal(2));
v.addNorthWest(new Variable(1));
h2.addNorthWest(new Variable(2));



assert(e1.equals(h1), true);
assert(e2.equals(h2), true);
assert(e3.equals(h3), true);
