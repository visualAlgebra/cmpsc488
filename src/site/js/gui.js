function findQuadrant(x) {
  if (x.parent) {
    return x.parent.NW.some(e=>Object.is(e, x)) ? Quadrant.NW : Quadrant.SE;
  } else {
    return null;
  }
}

const MouseMode = {
  Manipulation: "General Manipulation",
  MergingLiterals: "Merging Literals",
  Distribution: "Distribution"
};

const mouse = {
  state: "idle",
  eventSource: null,
  eventDest: null,
  mode: MouseMode.Manipulation,

  reset: function() {
    this.state = "idle";
    this.eventSource = null;
    this.eventDest = null;
  },

  redisplayExpressionTree: function() {
    displayExpressionTree(workingExpressionTree, "canvasContainer", res=>addHistoryEntry(res));
  },

  dragDetected: function() {
    console.log("Dragged from", this.eventSource, "to", this.eventDest);
    const x = this.eventSource.tree;
    const y = this.eventDest.tree;

    const xQuad = findQuadrant(x);
    const yQuad = findQuadrant(y);
    
    console.log(x,y,xQuad, yQuad)

    // Associative Insert IF
    //    Trees have same parent
    //    Trees are not same object
    //    eventDest is a quadrant <--
    //    ...
    if (Object.is(x.parent, y.parent) && !Object.is(x, y) && this.eventDest instanceof TagQuadrantGui && y.orientation === y.parent.orientation && xQuad === yQuad && this.mode === MouseMode.Manipulation) {
      const action = new AssociativeInsert(x,y);
      if (action.verify()) {
        action.apply();
        console.log("Inserting", x, "to tag", y);
      }

      this.redisplayExpressionTree();
    }
    else if (Object.is(x.parent.parent, y) && !Object.is(x, y) && this.eventDest instanceof TagQuadrantGui && x.parent.orientation === y.orientation && xQuad === yQuad && this.mode === MouseMode.Manipulation) {
      const action = new AssociativeExtract(x, xQuad);
      if (action.verify()) {
        action.apply();
        console.log("Extracting", x, "from", x.parent);
      }

      this.redisplayExpressionTree();
    }
    else if (Object.is(x.parent, y.parent) && xQuad === yQuad && !Object.is(x, y) && this.mode === MouseMode.Manipulation) {
      const action = new CommutativeSwap(x,y,xQuad);
      console.log(workingExpressionTree.toString());
      action.apply();
      console.log(workingExpressionTree.toString());
      console.log("Swapping siblings", x, "and", y);

      this.redisplayExpressionTree()
    }
    else if (x instanceof Tag && y instanceof Tag && this.eventSource instanceof TagButtonGui && this.eventDest instanceof TagButtonGui && Object.is(x.parent, y) && this.mode === MouseMode.Manipulation) {
      const action = new AssociativeMerge(x,y,xQuad);
      if (action.verify()) {
        action.apply();
        console.log("Merging", x, "into", y);
      }

      this.redisplayExpressionTree()
    }
    else if (x instanceof Literal && y instanceof Literal && Object.is(x.parent, y.parent) && !Object.is(x, y) && this.mode === MouseMode.MergingLiterals) {
      const action = new LiteralMerge(x,y,xQuad,yQuad);
      if(action.verify()){
        action.apply();
        console.log("Mergin Literals", x, "and", y);
      }
      this.redisplayExpressionTree();
    }
    else if (Object.is(x.parent, y.parent) && !Object.is(x, y) && y instanceof Tag && this.eventDest instanceof TagQuadrantGui && y.orientation === Orientation.EW && xQuad === yQuad && this.mode === MouseMode.Distribution) {
      const action = new Distribute(x, y); 
      if (action.verify()){
        action.apply();
        console.log("Distributing", x, "over", y);
      }
      this.redisplayExpressionTree();
    }


    this.reset();
  },

  clickDetected: function() {
    console.log("Mouse clicked on", this.eventSource);

    if (this.mode === MouseMode.Manipulation) {
      const action = new AssociativeIntro(this.eventSource.tree);
      action.apply();
      console.log("Enclosing ", this.eventSource.tree);

      this.redisplayExpressionTree();
    }

    this.reset();
  }
};

class GuiBase {
  onclick() {
    if (mouse.state !== "idle after drag") {
      mouse.eventSource = this;
      mouse.clickDetected();
    }
  }

  mousedown() {
    if (mouse.state === "idle") {
      mouse.state = "dragging?";
      mouse.eventSource = this;
    }
  }

  mousemove() {
    if (mouse.state === "dragging?") {
      mouse.state = "dragging";
    }
  }

  mouseup() {
    if (mouse.state === "dragging") {
      mouse.state = "idle after drag";
      mouse.eventDest = this;
      mouse.dragDetected();
    }
  }

  attachEventHandlers(dom) {
    dom.on("click", e=>{
      e.stopPropagation();
      this.onclick();
    }
    );

    dom.on("mousedown", e=>{
      e.stopPropagation();
      this.mousedown();
    }
    );

    dom.on("mousemove", e=>{
      e.stopPropagation();
      this.mousemove();
    }
    );

    dom.on("mouseup", e=>{
      e.stopPropagation();
      this.mouseup();
    }
    );
  }
}

class TagGui extends GuiBase {
  constructor(tag) {
    super();
    this.tree = tag;
    // Save the expression tree.
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $("<div>");

    div.addClass(this.tree.orientation == Orientation.NS ? "north-south" : "east-west");

    div.addClass("tag");
    div.data("expressionTree", this.tree);

    const nw = new TagQuadrantGui(this.tree,Quadrant.NW);
    const button = new TagButtonGui(this.tree);
    const se = new TagQuadrantGui(this.tree,Quadrant.SE);

    div.append(nw.dom);
    div.append(button.dom);
    div.append(se.dom);
    return div;
  }
}

class TagButtonGui extends GuiBase {
  constructor(tag) {
    super();
    this.tree = tag;
    this.dom = this.buildDom();
  }

  buildDom() {
    const button = $("<div>");
    button.addClass("tag-button");

    this.attachEventHandlers(button);

    const buttonColumn = $("<div>");
    buttonColumn.addClass("tag-button-column");
    buttonColumn.append(button);
    return buttonColumn;
  }
}

class TagQuadrantGui extends GuiBase {
  constructor(tag, quadrantLabel) {
    super();
    this.tree = tag;
    this.quadrantLabel = quadrantLabel;
    this.dom = this.buildDom();
  }

  buildDom() {
    const quadrant = $("<div>");
    const quadrantClass = (this.quadrantLabel === Quadrant.NW) ? "north-west" : "south-east";

    quadrant.addClass(quadrantClass);
    this.attachEventHandlers(quadrant);

    this.tree[this.quadrantLabel].forEach(child=>{
      if (child.kind === "tag") {
        quadrant.append(child.render());
      } else {
        const container = $("<div>");
        container.addClass("tag-element-container");
        container.append(child.render());
        quadrant.append(container);
      }
    }
    );

    return quadrant;
  }

}

class VariableGui extends GuiBase {
  constructor(variable) {
    super();
    this.tree = variable;
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $(`<div>x${this.tree.value}</div>`);

    this.attachEventHandlers(div);

    div.addClass("variable");
    div.data("expressionTree", this.tree);
    return div;
  }
}

class LiteralGui extends GuiBase {
  constructor(literal) {
    super();
    this.tree = literal;
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $(`<div>${this.tree.value}</div>`);

    this.attachEventHandlers(div);

    div.addClass("literal");
    div.data("expressionTree", this.tree);
    return div;
  }
}
