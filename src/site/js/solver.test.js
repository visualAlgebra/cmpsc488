import { Literal, Orientation, Quadrant, Tag, Variable } from "./expression_tree";
import { solve } from "./solver";
import {
  AssociativeExtract,
  AssociativeInsert, AssociativeIntro,
  AssociativeMerge, Cancel, CombineFrac,
  CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
  QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
} from "./algebraic_actions";

function newVar(val) {
  return new Variable(val);
}

function newLit(val) {
  return new Literal(val);
}

function SAssert (start, end, action) {
}

function SolverTest1() {
  let start = new Tag(Orientation.EW, [newLit(2), newLit(1), newVar(1)], [newVar(2)]);
  let end = new Tag(Orientation.EW, [newLit(2), newVar(1), newLit(1)], [newVar(2)])

  return solve(start, end) instanceof CommutativeSwap;
}

function SolverTest2() {
  let t1 = new Tag(Orientation.NS, [newVar(1), newLit(1)], [newVar(2)]);
  let start = new Tag(Orientation.NS, [newVar(3), newVar(4), t1], [newLit(2)]);
  let end = new Tag(Orientation.NS, [newVar(3), newVar(4)], [newLit(2), t1]);

  return solve(start, end) instanceof QuadrantFlip;
}

function SolverTest3() {
  const t1 = new Tag(Orientation.NS, [newLit(1)], [newVar(1), newVar(2)]);
  const t2 = new Tag(Orientation.NS, [newVar(3)], [newVar(1), newVar(2)]);
  const t3 = new Tag(Orientation.NS, [newLit(2), newLit(1)], [newVar(1), newVar(2)]);
  const start = new Tag(Orientation.EW, [t1, t3, t2]);

  const dividend = new Tag(Orientation.EW, [newLit(1), newVar(3), newLit(2)]);
  const end = new Tag(Orientation.NS, [dividend], [newVar(1), newVar(2)]);

  return solve(start, end) instanceof CommutativeSwap || solve(start, end) instanceof CombineFrac || solve(start, end) instanceof LiteralMerge;
}

function testAll() {
  if (SolverTest1()&&SolverTest2()&&SolverTest3()) {
    console.log('All solver tests passed');
  }
}