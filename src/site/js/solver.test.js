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
  var result = solve(start, end);
  if(result.action instanceof CommutativeSwap)
    console.log("Solver Test 1 Success");
  else
    console.log("Error wrong action returned in Solver Test 1", result);
}

function SolverTest2() {
  let t1 = new Tag(Orientation.NS, [newVar(1), newLit(1)], [newVar(2)]);
  let start = new Tag(Orientation.NS, [newVar(3), newVar(4), t1], [newLit(2)]);

  let t2 = new Tag(Orientation.NS, [newVar(2)], [newVar(1), newLit(1)]);
  let end = new Tag(Orientation.NS, [newVar(3), newVar(4)], [newLit(2), t2]);
  var result = solve(start, end);
  if(result.action instanceof QuadrantFlip)
    console.log("Solver Test 2 Success");
  else
    console.log("Error wrong action returned in Solver Test 2", result);
}

function SolverTest3() {
  const t1 = new Tag(Orientation.NS, [newLit(1)], [newVar(1), newVar(2)]);
  const t2 = new Tag(Orientation.NS, [newVar(3)], [newVar(1), newVar(2)]);
  const t3 = new Tag(Orientation.NS, [newLit(2), newLit(1)], [newVar(1), newVar(2)]);
  const start = new Tag(Orientation.EW, [t1, t3, t2]);

  const dividend = new Tag(Orientation.EW, [newLit(1), newVar(3), newLit(2)]);
  const end = new Tag(Orientation.NS, [dividend], [newVar(1), newVar(2)]);
  var result = solve(start, end); 
  if((result.action instanceof CommutativeSwap) || (result.action instanceof CombineFrac) || (result.action instanceof LiteralMerge))
    console.log("Solver Test 3 Success");
  else
    console.log("Error wrong action returned in Solver Test 3", result);
}

window.testAll = function() {
  SolverTest1();
  SolverTest2();
  SolverTest3();
}
