// import {
//   AssociativeExtract,
//   AssociativeInsert, AssociativeIntro,
//   AssociativeMerge, Cancel, CombineFrac,
//   CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
//   QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
// } from "./algebraic_actions";
import { ExpressionTree, Literal, Variable, Tag, Quadrant, Orientation, ProblemInfo } from "../expression_tree";

function determineProblem(problem, workTree) {
  switch (problem) {
    case 1: tutorialProblem1(workTree); break;
    case 2: tutorialProblem2(workTree); break;
    case 3: tutorialProblem3(workTree); break;
    case 4: tutorialProblem4(workTree); break;
    case 5: tutorialProblem5(workTree); break;
    case 6: tutorialProblem6(workTree); break;
    default: return null;
  }    
}

function tutorialProblem1(workTree) {
  
  // if (workTree.toString().equals("{tEW{{{l1}{v1}}{{l2}{v2}}}}")) {
  //   console.log("Good now try to make the working expression equal to the goal")
  // } else {
  //   console.log("Hello, welcome to Visual Algebra, try swapping two variables");
  // }
  console.log("Good now try to make the working expression equal to the goal");
}

function tutorialProblem2(workTree) {
}

function tutorialProblem3(workTree) {
}

function tutorialProblem4(workTree) {
}

function tutorialProblem5(workTree) {
}

function tutorialProblem6(workTree) {
}