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

export function getImg(problem) {
  switch (problem) {
    case 1: return imgTutProb1();
    case 2: return imgTutProb2();
    case 3: return imgTutProb3();
    case 4: return imgTutProb4();
    case 5: return imgTutProb5();
    default: return null;
  }
}

//TODO: Fix tutorial text
function tutorialProblem1() {
  
  let tutMessage = [];
  tutMessage.push("Hello, welcome to Visual Algebra. We'll show you how to use our system.");
  tutMessage.push("This shape we see here is what we call a tag. We call the small gray circle a tag button. " +
  "The grey and white rectangles are called quadrants. Inside the quadrants, there may be three things, tags, atoms, or unknowns. " +
  "Atoms are what we use to represent numbers. Unknowns are represent some atom where the value is not known. Together, these components " +
  "represent an algebraic expression.");
  tutMessage.push("When a tag is orientated horizonally, then elements are being added. We call this an East-West tag. " +
  "The elements in the right are being substracted from the elements on the left.");
  tutMessage.push("When a tag or orientated vertically, this means that the elements are being multiplied. We call this a North-South Tag. " +
  "The elements in top are being divided by the elements in the bottom. You may think of these as fractions.");
  tutMessage.push("You're objective is to create the expression tree the same as the goal. Using Algebraic Actions. Algebraic Actions are " +
  "what we use to manipulate the expression tree. As the name may imply, all of these actions are modeled after the things we can in traditional Algebra.");
  tutMessage.push("The first Algebraic Action we'll go over is Commutative Swap. In Transform mode, this action is done by simply dragging an element " +
  "on top of another in the same quadrant. Try it yourself on the Manipulator on Tutorial Problem 1. " +
  "Once you are done, you may move on to segment 2.");
  return tutMessage;
}

function tutorialProblem2() {

  let tutMessage = [];
  tutMessage.push("Now we'll talk about the Associative actions. There are four in total.");
  tutMessage.push("First we'll talk about Associative Intro. By clicking on any tag, we may enclose it into another tag. We can do this as many times " + 
  "as we like but try not to get too carried away!");
  tutMessage.push("To get rid of a tag, drag the outer tag button to the inner tag button. This is called Associative Merge. You can only do this when " +
  "you have two tags of the same orientation or when there is a single element in the white quadrant.");
  tutMessage.push("Next is Associative Extract. This is done by dragging an element into a outer parent. You may only do this when " + 
  "an element is in a tag of the same orientation of the outer tag.");
  tutMessage.push("Lastly is Associative Insert. This is done by doing the opposite of Associative Extract. Drag an element into a tag of the " +
  "same orientation as the tag the tag the element is in.");
  tutMessage.push("Now try these on Tutorial Problem 2. Once you are done, move on to segment 3.");
  return tutMessage;
}

function tutorialProblem3() {

  let tutMessage = [];
  tutMessage.push("Now lets talk about distributing and factoring. To preform these actions, Distribution mode must be on. Click Distribution to turn " +
  "on Distribution mode.");
  tutMessage.push("The first action we'll talk about is Distribute. To distribue, we need a North-West Tag, an East-West Tag, and " + 
  "an element in the North-West to distribute. We may distribute by simply dragging the element to distribute into the tag button of the East-West Tag " +
  "as shown. Notice how the orientation of the tag changes. As the name implies, this Action is modeled after distribution in Algebra.");
  tutMessage.push("Next we'll talk about is Factor. This action works just like factoring in algebra. " +
  "To factor, we need an East-West tag with North-South tags. Each North-South Tag must have the same matching element at the top of the North-South Quadrant. " +
  "To initiate the action, drag the matching element into a the quadrant of the outer parent.");
  tutMessage.push("Try these on Tutorial Problem 3. After you are done, move on to segement 4.")
  return tutMessage;
}

function tutorialProblem4() {

  let tutMessage = [];
  tutMessage.push("Now we'll talk about manipulating fractions. We have two actions for fractions, Split Fraction and Combine Fraction. " + 
  "Like for Distribute and Factor, these actions are done in the Distribution mode.");
  tutMessage.push("To split a fraction, we need an solely an East-West tag in the white quadrant of a North-South tag and something in the grey quadrant." +
  "To initiate the action, drag the tag button of the inner East-West Tag to the outer North-South Tag.");
  tutMessage.push("To combine fractions, simply drag one fraction on another. The divisor of the two fractions mut be the same.");
  tutMessage.push("Try these actions on Tutorial Problem 4. After you're done, move on to segment 5.")
  return tutMessage;

}

function tutorialProblem5() {

  let tutMessage = [];
  tutMessage.push("Now we'll go over some miscellaneous things. First we'll talk about Quadrant Flip.");
  tutMessage.push("To iniatite Quadrant Flip, drag a tag into the opposite quadrant. For this action to work, the inner tag must be the same " + 
  "orientation as the outer tag.");
  tutMessage.push("Next we'll talk about Cancel. If two tags that are equal and on opposite sides of a tag, you may cancel them by dragging the tag button of one" +
  "into the tag button of the other.");
  tutMessage.push("Finally, let's talk about Identity Balance. This action allows you to put any expression on both quadrants of a tag. " +
  "This mode is done by clicking on Insert. Click on a start and add elements as you choose. Try these actions on Tutorial Problem 5.")
  return tutMessage;
}

function tutorialProblem6() {
}

function imgTutProb1() {
  
  let imgs = [];
  imgs.push("");
  imgs.push("http://localhost:8080/src/site/assets/VAComps.png");
  imgs.push("http://localhost:8080/src/site/assets/EWTagEX.png");
  imgs.push("http://localhost:8080/src/site/assets/NSTagEX.png");
  imgs.push("http://localhost:8080/src/site/assets/SolveEx.gif");
  imgs.push("http://localhost:8080/src/site/assets/CommutativeSwap.gif");

  return imgs;
}

function imgTutProb2() {

  let imgs = [];
  imgs.push("");
  imgs.push("http://localhost:8080/src/site/assets/AssociativeIntro.gif");
  imgs.push("http://localhost:8080/src/site/assets/AssociativeMerge.gif");
  imgs.push("http://localhost:8080/src/site/assets/AssociativeExtract.gif");
  imgs.push("http://localhost:8080/src/site/assets/AssociativeInsert.gif");
  imgs.push("");

  return imgs;
}

function imgTutProb3() {

  let imgs = [];
  imgs.push("");
  imgs.push("http://localhost:8080/src/site/assets/Distribute.gif");
  imgs.push("http://localhost:8080/src/site/assets/Factor.gif");
  imgs.push("");

  return imgs;
}

function imgTutProb4() {

  let imgs = [];
  imgs.push("");
  imgs.push("http://localhost:8080/src/site/assets/SplitFrac.gif");
  imgs.push("http://localhost:8080/src/site/assets/CombineFrac.gif");
  imgs.push("");

  return imgs;
}

function imgTutProb5() {

  let imgs = [];
  imgs.push("");
  imgs.push("http://localhost:8080/src/site/assets/QuadrantFlip.gif");
  imgs.push("http://localhost:8080/src/site/assets/Cancel.gif");
  imgs.push("http://localhost:8080/src/site/assets/IdentityBalance.gif");
  
  return imgs;
}