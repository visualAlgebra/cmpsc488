import $ from "jquery";
import {displayExpressionTree} from "./display_feature";
import {addHistoryEntry} from "./history_nav";
import {Orientation, Quadrant} from "./expression_tree";
import {
  AssociativeExtract,
  AssociativeInsert, AssociativeIntro,
  AssociativeMerge, Cancel, CombineFrac,
  CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
  QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
} from "./algebraic_actions";

export const globals = {
  workingExpressionTree: null
};

export function findQuadrant(x) {
  if (x.parent) {
    return x.parent.NW.some(e => Object.is(e, x)) ? Quadrant.NW : Quadrant.SE;
  } else {
    return null;
  }
}

export const MouseMode = {
  Manipulation: "General Manipulation",
  MergingLiterals: "Merging Literals",
  Distribution: "Distribution"
};

export const mouse = {
  state: "idle",
  eventSource: null,
  eventDest: null,
  mode: MouseMode.Manipulation,

  reset: function () {
    this.state = "idle";
    this.eventSource = null;
    this.eventDest = null;
  },

  redisplayExpressionTree: function () {
    displayExpressionTree(globals.workingExpressionTree, "canvasContainer", res => {
      let temp=addHistoryEntry(res);
      if(temp){
        alert("Win");
      }
      });
  },

  dragDetected: function () {
    console.log("Dragged from", this.eventSource, "to", this.eventDest);
    const x = this.eventSource.tree;
    const y = this.eventDest.tree;

    const xQuad = findQuadrant(x);
    // noinspection JSSuspiciousNameCombination
    const yQuad = findQuadrant(y);
    console.log('x:', x);
    console.log('y:', y);
    console.log('xQuad:', xQuad, '\nyQuad:', yQuad);

    // Associative Insert IF
    //    Trees have same parent
    //    Trees are not same object
    //    eventDest is a quadrant <--
    //    ...
    try {
      if (this.mode === MouseMode.Manipulation && this.eventDest instanceof TagQuadrantGui && AssociativeInsert.verify(x, y)) {
  
        const action = new AssociativeInsert(x, y);
        action.apply();
  
        console.log("Inserting", x, "to tag", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Manipulation && this.eventDest instanceof TagQuadrantGui && AssociativeExtract.verify(x, y, xQuad, yQuad)) {
  
        const action = new AssociativeExtract(x, xQuad);
        action.apply();
  
        console.log("Extracting", x, "from", x.parent);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Manipulation && CommutativeSwap.verify(x, y, xQuad, yQuad)) {
  
        const action = new CommutativeSwap(x, y, xQuad);
        action.apply();
  
        console.log("Swapping siblings", x, "and", y);
  
        this.redisplayExpressionTree()
      }
      else if (this.mode === MouseMode.Manipulation && this.eventSource instanceof TagButtonGui && this.eventDest instanceof TagButtonGui && AssociativeMerge.verify(x, y)) {
  
        const action = new AssociativeMerge(x, y, xQuad);
        action.apply();
  
        console.log("Merging", x, "into", y);
  
        this.redisplayExpressionTree()
      }
      else if (this.mode === MouseMode.Manipulation && this.eventSource instanceof TagButtonGui && this.eventDest instanceof TagQuadrantGui && QuadrantFlip.verify(x, y, xQuad, yQuad)) {
  
        const action = new QuadrantFlip(x, xQuad);
        action.apply();
  
        console.log("Flipping", x);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Manipulation && Cancel.verify(x, y, xQuad, yQuad)) {
  
        const action = new Cancel(x, y);
        action.apply();
  
        console.log("Cancelling", x, "and", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.MergingLiterals && LiteralMerge.verify(x, y, xQuad, yQuad)) {
  
        const action = new LiteralMerge(x, y, xQuad, yQuad);
        action.apply();
  
        console.log("Merging Literals", x, "and", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.MergingLiterals && IdentityMerge.verify(x, y, xQuad, yQuad)) {
  
        const action = new IdentityMerge(x, y, xQuad, yQuad);
        action.apply();
  
        console.log("Identity Merging", x, "and", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.MergingLiterals && ZeroMerge.verify(x, y, xQuad, yQuad)) {
  
        const action = new ZeroMerge(x, y);
        action.apply();
  
        console.log("Zero Merging", x, "and", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Distribution && this.eventDest instanceof TagButtonGui && Distribute.verify(x, y, xQuad, yQuad)) {
  
        const action = new Distribute(x, y);
        action.apply();
  
        console.log("Distributing", x, "over", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Distribution && this.eventSource instanceof TagButtonGui && this.eventDest instanceof TagButtonGui && SplitFrac.verify(x, y)) {
  
        const action = new SplitFrac(y);
        action.apply();
  
        console.log("Splitting Fraction", y);
  
        this.redisplayExpressionTree();
      }
      // TODO: fix verfiy for Factor
      else if (this.mode === MouseMode.Distribution && this.eventDest instanceof TagQuadrantGui && Factor.verify(x, y)) {
  
        const action = new Factor(x, y);
        action.apply();
  
        console.log("Factoring", x, "from", y);
  
        this.redisplayExpressionTree();
      }
  
      else if (this.mode === MouseMode.Distribution && this.eventSource instanceof TagQuadrantGui && this.eventDest instanceof TagButtonGui && CombineFrac.verify(y, x)) {
  
        const action = new CombineFrac(y);
        action.apply();
  
        console.log("Splitting", y);
  
        this.redisplayExpressionTree();
      }
    } catch (error) {
      console.error("An invalid action has occured\n", error);
    }

    this.reset();
  },

  clickDetected: function () {
    console.log("Mouse clicked on", this.eventSource);

    try {
      if (this.mode === MouseMode.Manipulation && AssociativeIntro.verify(this.eventSource.tree)) {
        const action = new AssociativeIntro(this.eventSource.tree);
        action.apply();
        console.log("Enclosing ", this.eventSource.tree);
  
        this.redisplayExpressionTree();
      }
    } catch (error) {
      console.error("An invalid action has occured")
    }

    if (this.mode === MouseMode.MergingLiterals && LiteralConversion.verify(this.eventSource.tree)){
      const action = new LiteralConversion(this.eventSource.tree, findQuadrant(this.eventSource.tree));
      action.apply();
      console.log("Converting ", this.eventSource.tree);

      this.redisplayExpressionTree();
    }


    this.reset();
  }
};

export class GuiBase {
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

  // noinspection JSMethodCanBeStatic
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
    }
    );

    dom.on("mousedown", e => {
      e.stopPropagation();
      this.mousedown();
    }
    );

    dom.on("mousemove", e => {
      e.stopPropagation();
      this.mousemove();
    }
    );

    dom.on("mouseup", e => {
      e.stopPropagation();
      this.mouseup();
    }
    );
  }
}

export class TagGui extends GuiBase {
  constructor(tag) {
    super();
    this.tree = tag;
    // Save the expression tree.
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $("<div>");

    div.addClass(this.tree.orientation === Orientation.NS ? "north-south" : "east-west");

    div.addClass("tag");
    div.data("expressionTree", this.tree);

    const nw = new TagQuadrantGui(this.tree, Quadrant.NW);
    const button = new TagButtonGui(this.tree);
    const se = new TagQuadrantGui(this.tree, Quadrant.SE);

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

    this.tree[this.quadrantLabel].forEach(child => {
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

export class VariableGui extends GuiBase {
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

export class LiteralGui extends GuiBase {
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
