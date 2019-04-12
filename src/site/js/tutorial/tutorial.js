// import {
//   AssociativeExtract,
//   AssociativeInsert, AssociativeIntro,
//   AssociativeMerge, Cancel, CombineFrac,
//   CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
//   QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
// } from "./algebraic_actions";
// import { ExpressionTree, Literal, Variable, Tag, Quadrant, Orientation, ProblemInfo } from "../expression_tree";

export function determineProblem(problem) {
  switch (problem) {
    case 1: return tutorialProblem1(); 
    case 2: return tutorialProblem2(); 
    case 3: return tutorialProblem3(); 
    case 4: return tutorialProblem4(); 
    case 5: return tutorialProblem5(); 
    case 6: return tutorialProblem6(); 
    default: return null;
  }    
}
//TODO: Fix tutorial text
function tutorialProblem1() {
  
  let tutMessage = [];
  tutMessage.push("Hello, welcome to Visual Algebra. We'll show you how to use our system.");
  tutMessage.push("This shape we see here is what we call an expression tree. We call the small gray circle a tag button." +
  "The grey and white rectangles are called quadrants. Together, these components represent an algebraic expression.");
  tutMessage.push("When a tag is orientated horizonally, then elements are being added. We call this an East-West tag." +
  "The elements in the right are being substracted from the elements on the left.");
  tutMessage.push("When a tag or orientated vertically, this means that the elements are being multiplied. We call this a North-South Tag." +
  "The elements in top are being divided by the elements in the bottom. You may think of these as fractions.");
  tutMessage.push("You're objective is to create the expression tree the same as the goal. Using Algebraic Actions. Algebraic Actions are" +
  "what we use to manipulate the expression tree. As the name may imply, all of these actions are modeled after the things we can in traditional Algebra.");
  tutMessage.push("The first Algebraic Action we'll go over is Commutative Swap. This action is done by simply dragging an element" +
  "on top of another in the same quadrant. Look into References if you want more information on Commutative Swap. Try it yourself on the Manipulator." +
  "Once you are done, you may move on to the next stage of the Tutorial.");
  return tutMessage;
}

function tutorialProblem2() {

  let tutMessage = [];
  tutMessage.push("Now we'll talk about the Associative actions. Try to click on the small tag circle\n");
  tutMessage.push("We see that we can enclose tags as many times as we want. This is called Associative Intro.\n");
  tutMessage.push("To close a tag, drag the outer tag button to the inner tag button. This is called Associative Merge.\n");
  tutMessage.push("Alright, now try dragging x2 to the outer tag. This action is called Associative Extract\n");
  tutMessage.push("Good, now try dragging it back in. This action is called Associative Insert\n");
  tutMessage.push("Good, now try solving the expression.\n");
  tutMessage.push("Great job, go to the next problem in the lesson.\n");
  return tutMessage;
}

function tutorialProblem3() {
  let tutMessage = [];
  tutMessage.push("Now lets talk about distributing and factoring.\n");
  tutMessage.push("Click on Distribution and try dragging that x1 to the outer tag.\n");
  tutMessage.push("Good, this is called Factor. This action works just like factoring in algebra." +
  "Notice how the enclosing tag is now vertical. So x1 is now being multiplied by the sum of the elements when x1 is factored out." +
  "Notice that there is a one where x1 used to be. Now try dragging the x1 back in the tag button.\n");
  tutMessage.push("Good, this is called Distribute. It works just like distributing in algebra. Now click on the reset button" +
  "and try to solve the problem. Notice how in the goal, the x1 is not factored from eveything. Hint: try to use an Associative Intro. \n");
  tutMessage.push("Good, now on to the next problem");
  return tutMessage;
}

function tutorialProblem4() {
  let tutMessage = [];
  tutMessage.push("Now we'll talk about manipulating fractions.\n");
  tutMessage.push("Click on Distribution and drag the tag button of the inner East-West Tag to the outer North-South Tag.\n");
  tutMessage.push("Good, you've split up the fraction. Notice how this action is similar to Factor. Now try to combine the first two fractions.\n");
  tutMessage.push("Awesome. Now on to the next problem.")
  return tutMessage;

}

function tutorialProblem5() {
  let tutMessage = [];
  tutMessage.push("Now we'll go over some miscellaneous things. First, try dragging the tag button of the bottom tag in the divisor into the numerator\n");
  tutMessage.push("Great, notice how the tag is now flipped. We call this a Tag Flip. This works with East-West Tags as well.\n");
  tutMessage.push("If two tags that are equal and on opposite sides of a tag, you may cancel them by dragging the tag button of one" +
  "into the tag button of the other. Try to find out on your own to get the two tags equal\n");
  tutMessage.push("Great, now on to the next problem.");
  return tutMessage;

}

function tutorialProblem6() {
}