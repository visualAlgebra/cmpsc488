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
    return x.parent.NW.some(e => e.is(x)) ? Quadrant.NW : Quadrant.SE;
  } else {
    return null;
  }
}

export const MouseMode = {
  Manipulation: "General Manipulation",
  MergingLiterals: "Merging Literals",
  Distribution: "Distribution",
  Insertion: "Insertion",
};

export const TreeComponentKind = {
  Tag: "Tag",
  TagQuadrant: "TagQuadrant",
  TagButton: "TagButton",
  Variable: "Variable",
  Literal: "Literal",
};

export const MouseState = {
  IdleAfterDrag: "idle after drag",
  Idle: "idle",
  MaybeDragging: "dragging?",
  Dragging: "dragging",
};

export class Mouse {
  constructor(vueComponent) {
    this.vueComponent = vueComponent;
    this.state = MouseState.Idle;
    this.eventSource = null;
    this.eventDest = null;
    this.mode = MouseMode.Manipulation;
  }

  reset() {
    this.state = MouseState.Idle;
    this.eventSource = null;
    this.eventDest = null;
  }

  redisplayExpressionTree() {
    displayExpressionTree(globals.workingExpressionTree, "canvasContainer", res => {
      let temp = addHistoryEntry(res);
      if (temp) {
        alert("Win");
      }
    });
  }

  dragDetected() {
    console.log("Dragged from", this.eventSource, "to", this.eventDest);
    const x = this.eventSource.tree;
    const y = this.eventDest.tree;

    const xQuad = findQuadrant(x);
    // noinspection JSSuspiciousNameCombination
    const yQuad = findQuadrant(y);
    console.log('x:', x);
    console.log('y:', y);
    console.log('xQuad:', xQuad, '\nyQuad:', yQuad);

    try {
      if (this.mode === MouseMode.Manipulation && this.eventDest.kind === TreeComponentKind.TagQuadrant && AssociativeInsert.verify(x, y)) {

        const action = new AssociativeInsert(x, y);
        action.apply();

        console.log("Inserting", x, "to tag", y);

        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Manipulation && this.eventDest.kind === TreeComponentKind.TagQuadrant && AssociativeExtract.verify(x, y, xQuad, yQuad)) {

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
      else if (this.mode === MouseMode.Manipulation && this.eventSource.kind === TreeComponentKind.TagButton && this.eventDest.kind === TreeComponentKind.TagButton && AssociativeMerge.verify(x, y)) {

        const action = new AssociativeMerge(x, y, xQuad);
        action.apply();

        console.log("Merging", x, "into", y);

        this.redisplayExpressionTree()
      }
      else if (this.mode === MouseMode.Manipulation && this.eventSource.kind === TreeComponentKind.TagButton && this.eventDest.kind === TreeComponentKind.TagQuadrant && QuadrantFlip.verify(x, y, xQuad, yQuad)) {

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
      else if (this.mode === MouseMode.Distribution && this.eventDest.kind === TreeComponentKind.TagButton && Distribute.verify(x, y, xQuad, yQuad)) {

        const action = new Distribute(x, y);
        action.apply();

        console.log("Distributing", x, "over", y);

        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Distribution && this.eventSource.kind === TreeComponentKind.TagButton && this.eventDest.kind === TreeComponentKind.TagButton && SplitFrac.verify(x, y)) {

        const action = new SplitFrac(y);
        action.apply();

        console.log("Splitting Fraction", y);

        this.redisplayExpressionTree();
      }
      // TODO: fix verfiy for Factor
      else if (this.mode === MouseMode.Distribution && this.eventDest.kind === TreeComponentKind.TagQuadrant && Factor.verify(x, y)) {

        const action = new Factor(x, y);
        action.apply();

        console.log("Factoring", x, "from", y);

        this.redisplayExpressionTree();
      }

      else if (this.mode === MouseMode.Distribution && this.eventSource.kind === TreeComponentKind.TagQuadrant && this.eventDest.kind === TreeComponentKind.TagButton && CombineFrac.verify(y, x)) {

        const action = new CombineFrac(y);
        action.apply();

        console.log("Splitting", y);

        this.redisplayExpressionTree();
      }
    } catch (error) {
      console.error("An invalid action has occured\n", error);
    }

    this.reset();
  }

  clickDetected() {
    console.log("Mouse clicked on", this.eventSource);

    try {
      if (this.mode === MouseMode.Manipulation && AssociativeIntro.verify(this.eventSource.tree)) {
        const action = new AssociativeIntro(this.eventSource.tree);
        action.apply();
        console.log("Enclosing ", this.eventSource.tree);

        this.redisplayExpressionTree();
      }
    } catch (error) {
      console.error("An invalid action has occurred")
    }

    if (this.mode === MouseMode.MergingLiterals && LiteralConversion.verify(this.eventSource.tree)){
      const action = new LiteralConversion(this.eventSource.tree, findQuadrant(this.eventSource.tree));
      action.apply();
      console.log("Converting ", this.eventSource.tree);

      this.redisplayExpressionTree();
    }

    this.reset();
  }
}

export const mouse = {
  state: MouseState.Idle,
  eventSource: null,
  eventDest: null,
  mode: MouseMode.Manipulation,

  reset: function () {
    this.state = MouseState.Idle;
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
      if (this.mode === MouseMode.Manipulation && this.eventDest.kind === TreeComponentKind.TagQuadrant && AssociativeInsert.verify(x, y)) {
  
        const action = new AssociativeInsert(x, y);
        action.apply();
  
        console.log("Inserting", x, "to tag", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Manipulation && this.eventDest.kind === TreeComponentKind.TagQuadrant && AssociativeExtract.verify(x, y, xQuad, yQuad)) {
  
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
      else if (this.mode === MouseMode.Manipulation && this.eventSource.kind === TreeComponentKind.TagButton && this.eventDest.kind === TreeComponentKind.TagButton && AssociativeMerge.verify(x, y)) {
  
        const action = new AssociativeMerge(x, y, xQuad);
        action.apply();
  
        console.log("Merging", x, "into", y);
  
        this.redisplayExpressionTree()
      }
      else if (this.mode === MouseMode.Manipulation && this.eventSource.kind === TreeComponentKind.TagButton && this.eventDest.kind === TreeComponentKind.TagQuadrant && QuadrantFlip.verify(x, y, xQuad, yQuad)) {
  
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
      else if (this.mode === MouseMode.Distribution && this.eventDest.kind === TreeComponentKind.TagButton && Distribute.verify(x, y, xQuad, yQuad)) {
  
        const action = new Distribute(x, y);
        action.apply();
  
        console.log("Distributing", x, "over", y);
  
        this.redisplayExpressionTree();
      }
      else if (this.mode === MouseMode.Distribution && this.eventSource.kind === TreeComponentKind.TagButton && this.eventDest.kind === TreeComponentKind.TagButton && SplitFrac.verify(x, y)) {
  
        const action = new SplitFrac(y);
        action.apply();
  
        console.log("Splitting Fraction", y);
  
        this.redisplayExpressionTree();
      }
      // TODO: fix verfiy for Factor
      else if (this.mode === MouseMode.Distribution && this.eventDest.kind === TreeComponentKind.TagQuadrant && Factor.verify(x, y)) {
  
        const action = new Factor(x, y);
        action.apply();
  
        console.log("Factoring", x, "from", y);
  
        this.redisplayExpressionTree();
      }
  
      else if (this.mode === MouseMode.Distribution && this.eventSource.kind === TreeComponentKind.TagQuadrant && this.eventDest.kind === TreeComponentKind.TagButton && CombineFrac.verify(y, x)) {
  
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
  constructor(kind) {
    this.kind = kind;
  }

  onclick() {
    if (mouse.state !== MouseState.IdleAfterDrag) {
      mouse.eventSource = this;
      mouse.clickDetected();
    }
  }

  mousedown() {
    if (mouse.state === MouseState.Idle) {
      mouse.state = MouseState.MaybeDragging;
      mouse.eventSource = this;
    }
  }

  // noinspection JSMethodCanBeStatic
  mousemove() {
    if (mouse.state === MouseState.MaybeDragging) {
      mouse.state = MouseState.Dragging;
    }
  }

  mouseup() {
    if (mouse.state === MouseState.Dragging) {
      mouse.state = MouseState.IdleAfterDrag;
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
    super(TreeComponentKind.Tag);
    this.tree = tag;
    // Save the expression tree.
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $(document.createElementNS("http://www.w3.org/1999/xhtml", "div"));

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
    super(TreeComponentKind.TagButton);
    this.tree = tag;
    this.dom = this.buildDom();
  }

  buildDom() {
    const button = $(document.createElementNS("http://www.w3.org/1999/xhtml", "div"));
    button.addClass("tag-button");
    button.addClass("hoverable");

    this.attachEventHandlers(button);

    const buttonColumn = $(document.createElementNS("http://www.w3.org/1999/xhtml", "div"));
    buttonColumn.addClass("tag-button-column");
    buttonColumn.append(button);
    return buttonColumn;
  }
}

class TagQuadrantGui extends GuiBase {
  constructor(tag, quadrantLabel) {
    super(TreeComponentKind.TagQuadrant);
    this.tree = tag;
    this.quadrantLabel = quadrantLabel;
    this.dom = this.buildDom();
  }

  buildDom() {
    const quadrant = $(document.createElementNS("http://www.w3.org/1999/xhtml", "div"));
    const quadrantClass = (this.quadrantLabel === Quadrant.NW) ? "north-west" : "south-east";

    quadrant.addClass(quadrantClass);
    quadrant.addClass("hoverable");

    this.attachEventHandlers(quadrant);

    this.tree[this.quadrantLabel].forEach(child => {
      if (child.kind === "tag") {
        quadrant.append(child.render());
      } else {
        const container = $(document.createElementNS("http://www.w3.org/1999/xhtml", "div"));
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
    super(TreeComponentKind.Variable);
    this.tree = variable;
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $(document.createElementNS("http://www.w3.org/1999/xhtml", "div"));
    div.text(`x${this.tree.value}`);

    this.attachEventHandlers(div);

    div.addClass("variable");
    div.addClass("hoverable");
    div.data("expressionTree", this.tree);
    return div;
  }
}

export class LiteralGui extends GuiBase {
  constructor(literal) {
    super(TreeComponentKind.Literal);
    this.tree = literal;
    this.dom = this.buildDom();
  }

  buildDom() {
    const div = $(document.createElementNS("http://www.w3.org/1999/xhtml", "div"));
    div.text(this.tree.value);

    this.attachEventHandlers(div);

    div.addClass("literal");
    div.addClass("hoverable");
    div.data("expressionTree", this.tree);
    return div;
  }
}
