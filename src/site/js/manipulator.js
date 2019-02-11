let expressionTree = new Tag(
  Orientation.EW,
  [
    new Literal(2),
    new Tag(
      Orientation.NS,
      [new Literal(1), new Variable(1)],
      [new Literal(0)]
    ),
    new Variable(2),
    new Tag(
      Orientation.EW,
      [new Literal(2)],
      []
    )
  ],
  [new Variable(3), new Literal(0)]
);

// let expressionTree = new Literal(1);

window.onload = () => {
  const container = document.getElementById("canvas-container");
  container.appendChild(expressionTree.render());
};
