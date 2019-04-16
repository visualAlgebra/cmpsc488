import {addHistoryEntry} from "./history_nav";
import {ExprTreeKind, Quadrant} from "./expression_tree";
import {
  AssociativeExtract,
  AssociativeInsert, AssociativeIntro,
  AssociativeMerge, Cancel, CombineFrac,
  CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
  QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
} from "./algebraic_actions";
import * as M from "materialize-css";


// Given a Tag instance, it will return the `n`th "child" of that tag where the
// "nth child" is defined like so:
//
//    [A B C]><[D E F]
//     ^ ^ ^    ^ ^ ^
//     0 1 2    3 4 5
//
function getNthChild(tag, n) {
  if (n < tag.NW.length) return tag.NW[n];
  n -= tag.NW.length;
  if (n < tag.SE.length) return tag.SE[n];
  throw "Bad index passed to `getNthChild`: fell off end of array!";
}

export function findDescendent(root, path) {
  for (const index of path) {
    if (root.kind === ExprTreeKind.Tag) {
      root = getNthChild(root, index);
    } else {
      throw "Bad path passed to `findDescendent`: path had Variable or Literal before end!";
    }
  }
  return root;
}

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

export const ClickTargetKind = {
  Tag: "Tag",
  TagQuadrant: "TagQuadrant",
  TagButton: "TagButton",
  Variable: "Variable",
  Literal: "Literal",
  InsertionButton: "InsertionButton",
};

export const MouseState = {
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

  redisplayExpressionTree(actionType) {
    const treeRoot = this.vueComponent.workTree;
    if (this.vueComponent.hasOwnProperty("resolveWin")) {
      this.vueComponent.resolveWin(addHistoryEntry(treeRoot, actionType));//TODO can only be manipulator vueComponent
    }
  }

  getEventCtx() {
    const x = findDescendent(this.vueComponent.workTree, this.eventSource.path);
    const y = findDescendent(this.vueComponent.workTree, this.eventDest.path);
    const xQuad = findQuadrant(x);
    const yQuad = findQuadrant(y);
    return { x, y, xQuad, yQuad };
  }

  dragDetected() {
    console.log("-----------------------------------------------------");
    console.log("Dragged from", this.eventSource, "to", this.eventDest);
    console.log("MOUSE MODE:", this.mode);

    try {
      if (this.mode === MouseMode.Insertion) {
        console.log("Inserting", this.eventSource, this.eventDest);
        if (this.eventDest.kind === ClickTargetKind.TagQuadrant) {
          const child = this.eventSource.tree.clone();
          const parent = findDescendent(this.vueComponent.workTree, this.eventDest.path);
          const quadrant = this.eventDest.quadrant;
          parent.insert(child, quadrant);
        }
        else {
          M.toast({ html: "Sorry, I don't understand!" });
        }
      }
      else if (this.mode === MouseMode.Manipulation) {

        const {x, y, xQuad, yQuad} = this.getEventCtx();

        if (this.eventDest.kind === ClickTargetKind.TagQuadrant && AssociativeInsert.verify(x, y)) {

          const action = new AssociativeInsert(x, y);
          action.apply();

          console.log("Inserting", x, "to tag", y);

          this.redisplayExpressionTree('Associative Insert');
        }
        else if (this.eventDest.kind === ClickTargetKind.TagQuadrant && AssociativeExtract.verify(x, y, xQuad, yQuad)) {

          const action = new AssociativeExtract(x, xQuad, yQuad);
          action.apply();

          console.log("Extracting", x, "from", x.parent);

          this.redisplayExpressionTree('Associative Extract');
        }
        else if (CommutativeSwap.verify(x, y, xQuad, yQuad)) {

          const action = new CommutativeSwap(x, y, xQuad);
          action.apply();

          console.log("Swapping siblings", x, "and", y);

          this.redisplayExpressionTree('Commutative Swap')
        }
        else if (this.eventSource.kind === ClickTargetKind.TagButton && this.eventDest.kind === ClickTargetKind.TagButton && AssociativeMerge.verify(x, y)) {

          const action = new AssociativeMerge(x, y, xQuad);
          action.apply();

          console.log("Merging", x, "into", y);

          this.redisplayExpressionTree('Associative Merge')
        }
        else if (this.eventSource.kind === ClickTargetKind.TagButton && this.eventDest.kind === ClickTargetKind.TagQuadrant && QuadrantFlip.verify(x, y, xQuad, yQuad)) {

          const action = new QuadrantFlip(x, xQuad);
          action.apply();

          console.log("Flipping", x);

          this.redisplayExpressionTree('Flipped quadrants');
        }
        else if (Cancel.verify(x, y, xQuad, yQuad)) {

          const action = new Cancel(x, y);
          action.apply();

          console.log("Cancelling", x, "and", y);

          this.redisplayExpressionTree('Cancelation');
        }
        else {
          M.toast({html: "Sorry, I don't understand!"});
        }
      }
      else if (this.mode === MouseMode.MergingLiterals) {

        const {x, y, xQuad, yQuad} = this.getEventCtx();

        if (LiteralMerge.verify(x, y, xQuad, yQuad)) {

          const action = new LiteralMerge(x, y, xQuad, yQuad);
          action.apply();

          console.log("Merging Literals", x, "and", y);

          this.redisplayExpressionTree('Merging Literals');
        }
        else if (IdentityMerge.verify(x, y, xQuad, yQuad)) {

          const action = new IdentityMerge(x, y, xQuad, yQuad);
          action.apply();

          console.log("Identity Merging", x, "and", y);

          this.redisplayExpressionTree('Merging Identities');
        }
        else if (ZeroMerge.verify(x, y, xQuad, yQuad)) {

          const action = new ZeroMerge(x, y);
          action.apply();

          console.log("Zero Merging", x, "and", y);

          this.redisplayExpressionTree('Cancel Zeros');
        }
        else {
          M.toast({html: "Sorry, I don't understand!"});
        }
      }
      else if (this.mode === MouseMode.Distribution) {

        const {x, y, xQuad, yQuad} = this.getEventCtx();

        if (this.eventSource.kind === ClickTargetKind.TagButton && this.eventDest.kind === ClickTargetKind.TagButton && CombineFrac.verify(x, y)) {

          const action = new CombineFrac(x, y, xQuad, yQuad);
          action.apply();

          console.log("Combining Fraction", x, y);

          this.redisplayExpressionTree('Combine Factor');
        } else if (this.eventDest.kind === ClickTargetKind.TagButton && Distribute.verify(x, y, xQuad, yQuad)) {

          const action = new Distribute(x, y);
          action.apply();

          console.log("Distributing", x, "over", y);

          this.redisplayExpressionTree('Distribution');
        } else if (this.eventSource.kind === ClickTargetKind.TagButton && this.eventDest.kind === ClickTargetKind.TagButton && SplitFrac.verify(x, y)) {

          const action = new SplitFrac(y);
          action.apply();

          console.log("Splitting Fraction", y);

          this.redisplayExpressionTree('Split a Fraction');
        } else if (this.eventDest.kind === ClickTargetKind.TagQuadrant && Factor.verify(x, y)) {

          const action = new Factor(x, y);
          action.apply();

          console.log("Factoring", x, "from", y);

          this.redisplayExpressionTree('Extract Factor');
        } else {
          M.toast({html: "Sorry, I don't understand!"});
        }
      }
    } catch (error) {
      M.toast({ html: "Uh-oh, an error occurred..." });
      console.error("An invalid action has occured\n", error);
    }

    this.reset();
  }

  clickDetected() {
    console.log("-----------------------------------------------------");
    console.log("Mouse clicked on", this.eventSource);

    const tree = findDescendent(this.vueComponent.workTree, this.eventSource.path);

    try {
      if (this.mode === MouseMode.Manipulation && AssociativeIntro.verify(tree)) {
        const action = new AssociativeIntro(tree);
        action.apply();
        console.log("Enclosing ", tree);

        this.redisplayExpressionTree('Introduce Tag');
      }
    } catch (error) {
      console.error("An invalid action has occurred")
    }

    if (this.mode === MouseMode.MergingLiterals && LiteralConversion.verify(tree)){
      const action = new LiteralConversion(tree, findQuadrant(tree));
      action.apply();
      console.log("Converting ", tree);

      this.redisplayExpressionTree('Convert Literal');
    }

    this.reset();
  }
}

