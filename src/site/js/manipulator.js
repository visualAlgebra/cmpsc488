let expressionTree = new Tag(Orientation.EW,[
    new Literal(2),
    new Tag(Orientation.NS,[new Literal(1), new Variable(1)], [new Literal(0)]),
    new Variable(2)
  ],
  [new Variable(3), new Literal(0)]
);

function sketch(p) {

  p.preload = () => {
  }

  p.setup = () => {
    p.createCanvas(700, 500);
    p.background(51);
    p.smooth();
  }

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    expressionTree.render(p);
  }
}

let p5Sketch = new p5(sketch, 'canvas-container');