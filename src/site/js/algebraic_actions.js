// USES OF ALGEBRAIC ACTIONS
// UI
// AI
// History Bar?
//   - Might just save instances of previous

// USE CASE FOR UI
// User specify that a swap needs to happen between siblings A and B.
// Create a CommutativeSwap instance whose sibling arguments are A and B.
// Serialize and Compress the current expression tree and store it in the history bar.
// Apply that action on the current expression tree in the manipulator window.

// USE CASE FOR AI
// AI has a list of all algebraic actions, choose an element
// choose location on the expression tree
// verify that this action is valid for this location in the tree
// if it is valid, apply the action to the tree
// ...
// If that was a bad choice, undo the algebraic action.

// 1 + 2 => 2 + 1
// 1 * 2 => 2 * 1
// Takes in two siblings and a quadrant(the list where the siblings are located).
// If the siblings and quadrant are valid, then the siblings will be swapped.
class CommutativeSwap {

  constructor(sibling1, sibling2, quadrantLabel) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrantLabel = quadrantLabel;
  }

  //verifys if the arguments are valid by checking
  //if the Siblings are in the same quadrant, then return true
  static verify(sibling1, sibling2, quadrant1, quadrant2) {
    const quadrant = sibling1.parent[quadrant1];
    return !Object.is(sibling1 , sibling2)
      && quadrant1 === quadrant2
      && Object.is(sibling1.parent, sibling2.parent)
      && quadrant.some(x => Object.is(x, sibling2))
      && quadrant.some(x => Object.is(x, sibling1));
  }

  //
  apply() {

    const parent = this.sibling1.parent;
    const temp = new Literal(-999);

    //Swapping the siblings
    parent.findAndReplace(this.sibling1, temp, this.quadrantLabel);
    parent.findAndReplace(this.sibling2, this.sibling1, this.quadrantLabel);
    parent.findAndReplace(temp, this.sibling2, this.quadrantLabel);
  }
}

// TODO: AssociativeMerge does not preserve order
//  [ 1 [2><] 3 ><]
//  [ 1 3 2 ><]

//Collapses the outer tag into the inner tag
class AssociativeMerge {
  constructor(sibling, parent, quadrantLabel) {
    this.sibling = sibling;
    this.parent = parent;
    this.quadrantLabel = quadrantLabel; // The quadrant that `sibling` is in.
  }

  //verifys if the arguments are valid by checking
  //if the sibling is included in the parent
  //then return true
  static verify(sibling, parent) {
    return Object.is(sibling.parent, parent) 
      && (parent.orientation === sibling.orientation || parent.treeCount - sibling.treeCount === 1)
      && sibling instanceof Tag
      && parent instanceof Tag;
  }


  apply() {

    //TODO: Let a tag of different orientation collapse if it only has one child

    //Having pointers to quadrants of sibling
    let newNW;
    let newSE;
    if (this.quadrantLabel === Quadrant.NW) {
      newNW = this.sibling.NW;
      newSE = this.sibling.SE;
      this.parent.removeNorthWest(this.sibling);
    } else {
      newNW = this.sibling.SE;
      newSE = this.sibling.NW;
      this.parent.removeSouthEast(this.sibling);
    }

    //adding sibling's children into parent
    for (let child of newNW) {
      this.parent.addNorthWest(child);
    }
    for (let child of newSE) {
      this.parent.addSouthEast(child);
    }
  }
}

//Encloses a tag with another tag of the same orientation
class AssociativeIntro {

  constructor(expr) {
    this.expr = expr;
  }

  //Valid if siblings is in parent in the correct order
  static verify(expr) {
    return expr instanceof Tag
      || expr.parent !== null;
  }

  apply() {

    const parent = this.expr.parent;

    if (parent !== null) {

      //make a new tag
      const newTag = new Tag(parent.orientation);

      //replace expr with newTag
      if (parent.NW.some(thing => Object.is(thing, this.expr))) {
        parent.findAndReplace(this.expr, newTag, Quadrant.NW);
      } else {
        parent.findAndReplace(this.expr, newTag, Quadrant.SE);
      }

      //add expr into new Tag
      newTag.addNorthWest(this.expr);
    } else {

      const copyNW = this.expr.NW;
      const copySE = this.expr.SE;

      //clear out expr
      this.expr.emptyNorthWest();
      this.expr.emptySouthEast();

      //if expr is a root tag,
      //make a copy of expr, newTag
      const newTag = new Tag(this.expr.orientation, copyNW, copySE);

      //add newTag into expr
      this.expr.addNorthWest(newTag);

    }

  }
}

// Taking out a sibling from a tag and adding it into its grandparent
// TODO: Make this preserve order
class AssociativeExtract {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(grandchild, quadrantLabel) {
    this.grandchild = grandchild;
    this.quadrantLabel = quadrantLabel;
  }

  static verify(grandchild, grandparent) {
    return grandparent !== null
      && grandchild.parent !== null
      && Object.is(grandchild.parent.parent, grandparent)
      && grandchild.parent.orientation === grandparent.orientation;
  }

  apply() {

    //setting pointers to parent and grandparent
    const parent = this.grandchild.parent;
    const grandparent = parent.parent;

    //removing grandchild from grandparent and prepending into parent
    if (this.quadrantLabel === Quadrant.NW) {
      parent.removeNorthWest(this.grandchild);
      grandparent.prependNorthWest(this.grandchild);
    } else {
      parent.removeSouthEast(this.grandchild);
      grandparent.prependSouthEast(this.grandchild);
    }
  }
}

// [ x [ y >< z ] ><]
// =>
// [ [ x y >< z ] ><]
//Inserting a sibling into a sibling tag that has the same orientation as its parent
//TODO: make sure this preserves order
class AssociativeInsert {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(sibling, insertionTag) {
    this.sibling = sibling;
    this.insertionTag = insertionTag;
  }

  static verify(sibling, insertionTag, xQuad, yQuad) {
    return sibling.parent !== null
      && sibling.parent.orientation === insertionTag.orientation
      && Object.is(sibling.parent, insertionTag.parent)
      && !Object.is(sibling, insertionTag)
      && xQuad === yQuad;
  }

  apply() {

    //setting pointer to parent
    const parent = this.sibling.parent;

    //removing pointer to sibling in parent
    if (parent.NW.some(thing => Object.is(thing, this.sibling))) {
      parent.removeNorthWest(this.sibling);
    } else {
      parent.removeSouthEast(this.sibling);
    }

    //inserting sibling into intersion tag
    this.insertionTag.prependNorthWest(this.sibling);
  }
}

class Distribute {
  constructor(value, tagToDistributeOver) {
    this.value = value;
    this.tagToDistributeOver = tagToDistributeOver;
  }

  static verify(value, tagToDistributeOver, xQuad, yQuad) {
    if (xQuad !== yQuad)
      return false;
    
    if (value.parent !== tagToDistributeOver.parent)
      return false;

    if (Object.is(value, tagToDistributeOver))
      return false;

    if (!tagToDistributeOver instanceof Tag)
      return false;

    if (value.parent.orientation !== Orientation.NS)
      return false;
    
    if (tagToDistributeOver.orientation !== Orientation.EW)
      return false;

    return true;
  }

  apply() {

    //Arrays to store new tags
    let newNW = [];
    let newSE = [];

    //pushing the new tags into the arrays
    for (let child of this.tagToDistributeOver.NW) {
      newNW.push(new Tag(Orientation.NS, [this.value.clone(), child]));
    }
    for (let child of this.tagToDistributeOver.SE) {
      newSE.push(new Tag(Orientation.NS, [this.value.clone(), child]));
    }

    //setting parent pointer
    const parent = this.value.parent;

    if (parent.NW.length === 2) {
      //Flipping orientation of the parent
      parent.orientation = Orientation.EW;
  
      //clearing out the NW quadrant and adding in the new tags
      parent.emptyNorthWest();
      for (let child of newNW) {
        parent.addNorthWest(child);
      }
  
      //clearing out the SE quadrant and adding in the new tags
      parent.emptySouthEast();
      for (let child of newSE) {
        parent.addSouthEast(child);
      }
    } else {
      parent.removeNorthWest(this.value);
      parent.removeNorthWest(this.tagToDistributeOver);
      let newTag = new Tag(Orientation.EW, newNW, newSE);
      parent.prependNorthWest(newTag);
    }

  }
}

class Factor {
  constructor(valueToFactor, tagToFactor) {
    this.valueToFactor = valueToFactor;
    this.tagToFactor = tagToFactor;
  }

  static verify(tagToFactor, valueToFactor) {
    if (tagToFactor.orientation != "eastwest")
      return false;
    for (var i = 0; i<tagToFactor.NW.length; i++){
      if (tagToFactor.NW[i] instanceof Tag){
        if(tagToFactor.NW[i].NW[0] !== valueToFactor)
          return false;
      }
      else{
        if (tagToFactor.NW[i].value !== valueToFactor)
          return false;
      }
    }

    return true;

  }



  apply() {
    this.tagToFactor.orientation = Orientation.NS;
    var addTag = new Tag(Orientation.EW);
    const tagToFactorNWlength = this.tagToFactor.NW.length;
    for (var i = 0; i < tagToFactorNWlength; i++) {
      if ((this.tagToFactor.NW[0] instanceof Variable) || (this.tagToFactor.NW[0] instanceof Literal)) {
        this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
        addTag.addNorthWest(new Literal(1));
      }
      else {
        this.tagToFactor.NW[0].removeNorthWest(this.tagToFactor.NW[0].NW[0]);
        if (this.tagToFactor.NW[0].NW.length + this.tagToFactor.NW[0].SE.length == 1) {
          addTag.addNorthWest(this.tagToFactor.NW[0].NW[0]);
          this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
        }
        else if (this.tagToFactor.NW[0].NW.length + this.tagToFactor.NW[0].SE.length != 0) {
          addTag.addNorthWest(this.tagToFactor.NW[0]);
          this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
        }
        else {
          this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
          addTag.addNorthWest(new Literal(1));
        }
      }

    }

    var tagToFactorSELength = this.tagToFactor.SE.length;
    for (var i = 0; i < tagToFactorSELength; i++) {
      if (!(this.tagToFactor.SE[0] instanceof Tag)) {
        this.tagToFactor.removeSouthEast(this.tagToFactor.SE[0]);
        var add = new Literal(1);
        addTag.addSouthEast(add);
      }
      else {
        this.tagToFactor.SE[0].removeNorthWest(this.tagToFactor.SE[0].NW[0]);
        if (this.tagToFactor.SE[0].NW.length + this.tagToFactor.SE[0].SE.length == 1) {
          addTag.addSouthEast(this.tagToFactor.SE[0].NW[0]);
          this.tagToFactor.removeSouthEast(this.tagToFactor.SE[0]);
        }
        else if (this.tagToFactor.SE[0].NW.length + this.tagToFactor.SE[0].SE.length !== 0) {
          addTag.addSouthEast(this.tagToFactor.SE[0]);
          this.tagToFactor.removeSouthEast(this.tagToFactor.SE[0]);
        }
        else {
          this.tagToFactor.removeSouthEast(this.tagToFactor.SE[0]);
          addTag.addSouthEast(new Literal(1));
        }
      }

    }

    this.tagToFactor.addNorthWest(addTag);
    this.tagToFactor.prependNorthWest(this.valueToFactor);



  }
}

// if a NS tag has a sole EW tag in it's N quadrant, then split it
class SplitFrac {
  constructor(tag) {
    this.tag = tag;
  }

  static verify(dividend, frac) {
    return dividend instanceof Tag
      && frac instanceof Tag
      && frac.orientation === Orientation.NS
      && dividend.orientation === Orientation.EW
      && Object.is(dividend.parent, frac)
      && (dividend.NW.length + dividend.SE.length > 1)
      && frac.SE.length >= 1;
  }

  apply() {

    //create empty array to put split fractions
    let newNW = [];
    let newSE = [];
    let divisor = this.tag.SE;

    //Push the split fractions into their respective quadrants
    for (let child of this.tag.NW[0].NW) {
      //Cloning the children in divisor
      let newDivisor = [];
      for (let div of divisor) {
        newDivisor.push(div.clone());
      }
      //Adding the new tags into NW quadrant
      newNW.push(new Tag(Orientation.NS, [child], newDivisor));
    }
    for (let child of this.tag.NW[0].SE) {
      //Cloning the children in divisor
      let newDivisor = [];
      for (let div of divisor) {
        newDivisor.push(div.clone());
      }
      //adding the new tags into SE quadrant
      newSE.push(new Tag(Orientation.NS, [child], newDivisor));
    }

    //update the tag with new orientation and quadrants
    this.tag.orientation = Orientation.EW;
    this.tag.emptyNorthWest();
    for (let child of newNW) {
      this.tag.addNorthWest(child);
    }
    this.tag.emptySouthEast();
    for (let child of newSE) {
      this.tag.addSouthEast(child);
    }
  }
}

//Combine an EW tag of NS tags that have a common S quadrant
class CombineFrac {
  //Where sibligns is the list of
  constructor(tag) {
    this.tag = tag;
  }

  static verify(tag, divisor) {
    if (tag.orientation !== Orientation.EW) {
      return false;
    }
    
    for (let frac of tag.NW.concat(tag.SE)) {
      // if (child.SE !== divisor) {
      //   return false;
      // }
      if (divisor instanceof Tag) {
        for (let i = 0; i < tag.length; i++) {
          if (!(frac.SE[i].equals(divisor[i]))) {
            return false;
          }
        }
      }
    }
    return true;
  }

  apply() {

    //Creating new NW and SE quadrants
    let newNW = [];
    let newSE = [];

    //Creating divisor
    let divisor;

    //creating the dividend
    for (let child of this.tag.NW) {
      newNW = newNW.concat(child.NW);
      divisor = child.SE;
    }
    for (let child of this.tag.SE) {
      newSE = newSE.concat(child.NW);
      divisor = child.SE;
    }
    let dividend = new Tag(Orientation.EW, newNW, newSE);

    //Swapping orientation
    this.tag.orientation = Orientation.NS;

    //Adding the dividend
    this.tag.emptyNorthWest();
    this.tag.addNorthWest(dividend);

    //Adding divisor
    this.tag.emptySouthEast();
    for (let child of divisor) {
      this.tag.addSouthEast(child);
    }
  }
}

// [x><]
// =>
// [><[><x]]
//x = 1/(1/x)
//x = -(-x)
//Flipping the NW and SE quadrants when a tag switches quadrants in its parent
class QuadrantFlip {
  constructor(tag, quadrantLabel) {
    this.tag = tag;
    this.quadrantLabel = quadrantLabel;
  }

  static verify(tag, parent, xQuad, yQuad) {
    return tag instanceof Tag
      && parent !== null
      && Object.is(tag.parent, parent)
      && xQuad !== yQuad;
  }

  apply() {

    //Setting pointer to parent
    const parent = this.tag.parent;

    //Swapping quadrants
    const temp = this.tag.NW;
    this.tag.NW = this.tag.SE;
    this.tag.SE = temp;

    //Adding the tag into it's opposite quadrant;
    if (this.quadrantLabel === Quadrant.NW) {
      parent.removeNorthWest(this.tag);
      parent.addSouthEast(this.tag);
    } else {
      parent.removeSouthEast(this.tag);
      parent.addNorthWest(this.tag);
    }

  }
}

//Canceling two siblings in opposite quadrants with equal value in a tag
class Cancel {
  constructor(sibling1, sibling2) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
  }

  static verify(x, y, xQuad, yQuad) {
    return x.equals(y)
      && !Object.is(x, y)
      && Object.is(x.parent, y.parent)
      && xQuad !== yQuad; 
  }

  apply() {

    //setting pointer to parent
    const parent = this.sibling2.parent;

    //removing the siblings
    parent.removeNorthWest(this.sibling1);
    parent.removeSouthEast(this.sibling2);
  }
}

//Adding two siblings of equal value into the top and bottom quadrants of a tag
//Only works with variables and literals
class IdentityBalance {
  constructor(newChild, tag) {
    this.newChild = newChild;
    this.tag = tag;
  }

  static verify(newChild, tag) {
    if (tag.orientation == Orientation.NS){
      if ((newChild instanceof Literal) && newChild.value == 0)
        return false;
      if (newChild instanceof Tag)
        return tagVerify(newChild)
    }
    return true;
  }

  apply() {
    //creating of the new child to add
    let copy = this.newChild.clone();

    //adding a children in both quadrants
    this.tag.addNorthWest(this.newChild);
    this.tag.addSouthEast(copy);
  }
}

class LiteralMerge {
  constructor(literalA, literalB, quadrantA, quadrantB) {
    this.literalA = literalA;
    this.literalB = literalB;
    this.quadrantA = quadrantA;
    this.quadrantB = quadrantB;
  }

  static verify(literalA, literalB, quadrantA, quadrantB) {
    if (literalA.parent !== literalB.parent)
      return false;
    if (!(literalA instanceof Literal && literalB instanceof Literal)) 
      return false;
    if (Object.is(literalA, literalB))
      return false;
    if (literalA.parent.orientation == Orientation.EW)
      return true;
    if (quadrantA != quadrantB)
      return false;
    if (quadrantA == Quadrant.SE)
      return false;
    return true;
  }

  apply() {
    if (this.literalA.parent.orientation == Orientation.EW) {
      if (this.quadrantA == Quadrant.NW) {
        if (this.quadrantB == Quadrant.NW) {
          this.literalA.value = (this.literalA.value + this.literalB.value) % 3;
          this.literalA.parent.removeNorthWest(this.literalB);
        }
        else {
          this.literalA.value = (((this.literalA.value - this.literalB.value) % 3) + 3) % 3;
          this.literalA.parent.removeSouthEast(this.literalB);
        }
      }
      else if (this.quadrantB == Quadrant.NW) {
        this.literalB.value = (((this.literalB.value - this.literalA.value) % 3) + 3) % 3;
        this.literalB.parent.removeSouthEast(this.literalA);
      }
      else {
        this.literalA.value = Math.abs(-3 + (-1*(this.literalA.value + this.literalB.value)) % 3);
        this.literalA.parent.removeSouthEast(this.literalB);
      }
    }
    else {
      this.literalA.value *= this.literalB.value;
      this.literalA.value %= 3;
      this.literalA.parent.removeNorthWest(this.literalB);
    }
  }
}

class ZeroMerge{
  constructor(sibling1, sibling2){
    this.sibling1  = sibling1;
    this.sibling2 = sibling2;
  }

  static verify(sibling1, sibling2){
    
    if (Object.is(sibling1, sibling2)) 
      return false; 
    
    if (sibling1.parent != sibling2.parent)
      return false;
    if (sibling1.parent.orientation != Orientation.NS)
      return false;

    return true;
  }

  apply(){
    if (this.sibling1 instanceof Literal){
      if (this.sibling1.value = 0)
        this.sibling1.parent.removeNorthWest(this.sibling2);
      else
        this.sibling2.parent.removeNorthWest(this.sibling1);
    }
    else
      this.sibling2.parent.removeNorthWest(this.sibling1)
  }
}

class IdentityMerge{
  constructor(sibling1, sibling2, quadrant1, quadrant2){
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrant1 = quadrant1;
    this.quadrant2 = quadrant2;
  }

  static verify(sibling1, sibling2, quadrant1, quadrant2){

    if (Object.is(sibling1, sibling2))
      return false;

    if (sibling1.parent != sibling2.parent)
      return false;
    if (sibling1.parent.orientation == Orientation.NS){
      if(quadrant1 != Quadrant.NW || quadrant1 != quadrant2)
        return false;
      if (sibling1 instanceof Literal){
        if(sibling1.value == 1)
          return true;
        if (sibling2 instanceof Literal)
          return sibling2.value == 1;
      }
      if (sibling2 instanceof Literal)
        return sibling2.value == 1;

      if(quadrant1 == Quadrant.NW && quadrant1 == quadrant2)
        return true;
      return false;
    }
    if(sibling1 instanceof Literal){
      if (sibling1.value == 0)
        return true;
      if (sibling2 instanceof Literal)
        return sibling2.value == 0;
    }
    if (sibling2 instanceof Literal)
      return sibling2.value == 0;
      
    return false;
  }

  apply(){
    if (this.sibling1.parent.orientation == Orientation.NS)
      if (this.sibling1 instanceof Literal && this.sibling1.value == 1)
        this.sibling2.parent.removeNorthWest(this.sibling1);
      else
        this.sibling1.parent.removeNorthWest(this.sibling2);
    
    else{
      if (this.sibling1 instanceof Literal && this.sibling1.value == 0){
        if (this.quadrant1 == Quadrant.NW)
          this.sibling2.parent.removeNorthWest(this.sibling1);
        else
          this.sibling2.parent.removeSouthEast(this.sibling1)
      }
      else{
        if (this.quadrant2 == Quadrant.NW)
          this.sibling1.parent.removeNorthWest(this.sibling2);
        else
          this.sibling1.parent.removeSouthEast(this.sibling2);
      }
    }
  }
}
