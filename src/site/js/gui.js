const mouse = {
  state: "idle",
  eventSource: null,
  eventDest: null,

  reset: function() {
    this.state = "idle";
    this.eventSource = null;
    this.eventDest = null;
  },


  redisplayExpressionTree: function() {
    displayExpressionTree(workingExpressionTree, "canvas-container");
  },

  dragDetected: function() {
    console.log("Dragged from", this.eventSource, "to", this.eventDest);
    const x = this.eventSource.tree;
    const y = this.eventDest.tree;

    // TODO: Make sure this works smoothly for ROOT ELEMENT which has no
    // parent!       __/
    //              /
    //              V
    const xQuad = x.parent.NW.some(e => Object.is(e, x))
      ? Quadrant.NW
      : Quadrant.SE;

    const yQuad = y.parent.NW.some(e => Object.is(e, y))
      ? Quadrant.NW
      : Quadrant.SE;

    if (Object.is(x.parent, y.parent) && !Object.is(x,y) && y instanceof Tag
    && y.orientation === y.parent.orientation && xQuad === yQuad) {
      const action = new AssociativeInsert(x, y);
      action.apply();
      console.log("Inserting", x, "to tag", y)

      this.redisplayExpressionTree();
    }

    else if (Object.is(x.parent, y.parent) && xQuad === yQuad) {
      const action = new CommutativeSwap(x, y, xQuad);
      action.apply();
      console.log("Swapping siblings", x, "and", y);

      this.redisplayExpressionTree()
    }

    this.reset();
  },

  clickDetected: function() {
    console.log("Mouse clicked on", this.eventSource);

    const action = new AssociativeIntro(this.eventSource.tree);
    action.apply();
    console.log("Enclosing ", this.eventSource.tree);

    this.redisplayExpressionTree();

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
    dom.on("click", e => {
      e.stopPropagation();
      this.onclick();
    });

    dom.on("mousedown", e => {
      e.stopPropagation();
      this.mousedown();
    });

    dom.on("mousemove", e => {
      e.stopPropagation();
      this.mousemove();
    });

    dom.on("mouseup", e => {
      e.stopPropagation();
      this.mouseup();
    });
  }
}

class TagGui extends GuiBase {
  constructor(tag) {
    super();
    this.tree = tag; // Save the expression tree.
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $("<div>");

    this.attachEventHandlers(div);

    div.addClass(
      this.tree.orientation == Orientation.NS ? "north-south" : "east-west"
    );

    div.addClass("tag");
    div.data("expressionTree", this.tree);

    const nw = $("<div>");
    nw.addClass("north-west");

    const button = $("<div>");
    button.addClass("tag-button");

    const buttonColumn = $("<div>");
    buttonColumn.addClass("tag-button-column");
    buttonColumn.append(button);

    const se = $("<div>");
    se.addClass("south-east");

    function appendTo(element, child) {
      if (child.kind === "tag") {
        element.append(child.render());
      } else {
        const container = $("<div>");
        container.addClass("tag-element-container");
        container.append(child.render());
        element.append(container);
      }
    }

    this.tree.NW.forEach(child => {
      appendTo(nw, child);
    });

    this.tree.SE.forEach(child => {
      appendTo(se, child);
    });

    div.append(nw);
    div.append(buttonColumn);
    div.append(se);
    return div;
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
