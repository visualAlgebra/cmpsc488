// import {
//   AssociativeExtract,
//   AssociativeInsert, AssociativeIntro,
//   AssociativeMerge, Cancel, CombineFrac,
//   CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
//   QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
// } from "./algebraic_actions";
// import { ExpressionTree, Literal, Variable, Tag, Quadrant, Orientation, ProblemInfo } from "../expression_tree";

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
  
  let tutMessage = [];
  tutMessage.push("Hello, welcome to Visual Algebra\n" +
  "This shape we see here is what we call an expression tree\n");
  tutMessage.push("We call the small gray circle a tag button\n");
  tutMessage.push("When a tag is orientated horizonally, then elements are being added.\n")
  tutMessage.push("You're objective is to create the expression tree the same as the goal\n");
  tutMessage.push("Try dragging a child onto another child\n");
  tutMessage.push("Good. This action is called Commutative Swap. Now try to make the working expression the same as the goal\n");
  tutMessage.push("Great job, go to the next problem in the lesson\n");

  for (let message of tutMessage) {
    console.log(message);
  }
}

function tutorialProblem2(workTree) {

  let tutMessage = [];
  tutMessage.push("Notice how the tags are vertical this time. This means that the elements are being added.\n");
  tutMessage.push("Now we'll talk about the Associative actions. Try to click on the small tag circle\n");
  tutMessage.push("We see that we can enclose tags as many times as we want. This is called Associative Intro.\n");
  tutMessage.push("To close a tag, drag the outer tag button to the inner tag button. This is called Associative Merge.\n");
  tutMessage.push("Alright, now try dragging x2 to the outer tag. This action is called Associative Extract\n");
  tutMessage.push("Good, now try dragging it back in. This action is called Associative Insert\n");
  tutMessage.push("Good, now try solving the expression.\n");
  tutMessage.push("Great job, go to the next problem in the lesson.\n");
}

function tutorialProblem3(workTree) {
  let tutMessage = [];
  tutMessage.push("Now we will talk about distributing and factoring.\n");
  tutMessage.push("Click on Distribution and try dragging that x1 to the outer tag.\n");
  tutMessage.push("Good, this is called Factor. This action works just like factoring in algebra." +
  "Notice how the enclosing tag is now vertical. So x1 is now being multiplied by the sum of the elements when x1 is factored out." +
  "Notice that there is a one where x1 used to be. Now try dragging the x1 back in the tag button.\n");
  tutMessage.push("Good, this is called Distribute. It works just like distributing in algebra. Now click on the reset button" +
  "and try to solve the problem. Notice how in the goal, the x1 is not factored from eveything. Hint: try to use an Associative Intro. \n");
  tutMessage.push("Good, now on to the next problem");
}

function tutorialProblem4(workTree) {
}

function tutorialProblem5(workTree) {
}

function tutorialProblem6(workTree) {
}