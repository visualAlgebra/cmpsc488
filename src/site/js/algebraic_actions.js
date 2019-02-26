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

  constructor (sibling1, sibling2, quadrantLabel) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrantLabel = quadrantLabel;
  }

  //verifys if the arguments are valid by checking
  //if the Siblings are in the same quadrant, then return true
  verify () {
    const quadrant = this.sibling1.parent[this.quadrantLabel];
    return this.sibling1.parent === this.sibling2.parent
        && quadrant.some(x => Object.is(x, sibling2))
        && quadrant.some(x => Object.is(x, sibling1));
  }

  //
  apply () {

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
  verify() {
    // TODO: don't use includes, use `some` with Object.is
    return this.parent.NW.includes(this.sibling)
        || (this.parent.SE.includes(this.sibling) && this.parent.orientation === Orientation.EW);
  }


  apply() {

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
  verify() {
    return this.expr instanceof Tag
        || this.expr.parent !== null;
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

      //if expr is a root tag,
      //make a copy of expr, newTag
      const newTag = new Tag(this.expr.orientation, this.expr.NW, this.expr.SE);

      //clear out expr
      this.expr.emptyNorthWest();
      this.expr.emptySouthEast();

      //add newTag into expr
      this.expr.addNorthWest(newTag);

    }

  }
}

//Taking out a sibling from a tag and adding it into its grandparent
class AssociativeExtract {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(grandchild, quadrantLabel) {
    this.grandchild = grandchild;
    this.quadrantLabel = quadrantLabel;
  }

  verify() {
    return this.grandchild.parent !== null
        && this.grandchild.parent.parent !== null;
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
class AssociativeInsert {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(sibling, insertionTag) {
    this.sibling = sibling;
    this.insertionTag = insertionTag;
  }

  verify() {
    return this.sibling.parent !== null
        && this.sibling.parent.orientation === insertionTag.orientation;
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

  verify() {
    // return this.sibling1 and this.sibling2 are actually siblings;
  }

  apply() {
    // var tagToDistributeOverNWLength = this.tagToDistributeOver.NW.length;
    // this.tagToDistributeOver.parent.orientation = Orientation.EW;
    // for(var i = 0; i<tagToDistributeOverNWLength; i++){
    //   var multTag = new Tag(Orientation.NS);
    //   multTag.addNorthWest(this.value);
    //   multTag.addNorthWest(this.tagToDistributeOver.NW[i]);
    //   this.tagToDistributeOver.removeNorthWest(this.tagToDistributeOver.NW[i]);
    //   this.tagToDistributeOver.addNorthWest(multTag);
    // }

    let newNW = [];
    let newSE = [];
    let val = this.value.value;


    for (let child of this.tagToDistributeOver.NW) {
      if (this.value instanceof Literal) {
        newNW.push(new Tag(Orientation.NS, [new Literal(val), child]));
      } else if (this.value instanceof Variable) {
        newNW.push(new Tag(Orientation.NS, [new Variable(val), child]));
      }
    }
    for(let child of this.tagToDistributeOver.SE) {
      if (this.value instanceof Literal) {
        newNW.push(new Tag(Orientation.NS, [new Literal(val), child]));
      } else if (this.value instanceof Variable) {
        newNW.push(new Tag(Orientation.NS, [new Variable(val), child]));
      }
    }

    
    const parent = this.value.parent;
    parent.orientation = Orientation.EW;
    parent.emptyNorthWest();
    for (let child of newNW) {
      parent.addNorthWest(child);
    }
    parent.emptySouthEast();
    for (let child of newSE) {
      parent.addSouthEast(child);
    }
  }
}

class Factor {
  constructor(valueToFactor, tagToFactor) {
    this.valueToFactor = valueToFactor;
    this.tagToFactor = tagToFactor;
  }

  verify() {
    if(this.tagToFactor.orientation != "eastwest")
      return false;
    var isGood = true;
    for(var i = 0; i<this.tagToFactor.NW.length; i++){
      if(!this.this.tagToFactor.NW[i] instanceof Tag){
        if (this.this.tagToFactor.NW[i] !== valueToFactor)
          return false;
      }
      else{
          if(this.this.tagToFactor.NW[i].orientation !== "northsouth"){
            return false;
          }
          else{
            for(var j = 0; j<this.tagToFactor.NW[i].NW.length; j++){
              if (this.tagToFactor.NW[i].NW[j] == valueToFactor)
                isGood = true;
            }
            if(!isGood)
              return false;
            isGood = false;
          }
      }
    }

    return false;

  }



  apply() {
    this.tagToFactor.orientation = Orientation.NS;
    var addTag = new Tag(Orientation.EW);
    const tagToFactorNWlength = this.tagToFactor.NW.length;
    for(var i = 0; i<tagToFactorNWlength; i++){
      if ((this.tagToFactor.NW[0] instanceof Variable) || (this.tagToFactor.NW[0] instanceof Literal)){
        this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
        addTag.addNorthWest(new Literal(1));
      }
      else{
        this.tagToFactor.NW[0].removeNorthWest(this.tagToFactor.NW[0].NW[0]);
        if(this.tagToFactor.NW[0].NW.length+this.tagToFactor.NW[0].SE.length == 1){
          addTag.addNorthWest(this.tagToFactor.NW[0].NW[0]);
          this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
        }
        else if(this.tagToFactor.NW[0].NW.length + this.tagToFactor.NW[0].SE.length != 0){
          addTag.addNorthWest(this.tagToFactor.NW[0]);
          this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
        }
        else{
          this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
          addTag.addNorthWest(new Literal(1));
        }
      }

    }

    var tagToFactorSELength = this.tagToFactor.SE.length;
    for(var i = 0; i<tagToFactorSELength; i++){
      if (!(this.tagToFactor.SE[0] instanceof Tag)){
        this.tagToFactor.removeSouthEast(this.tagToFactor.SE[0]);
        var add = new Literal(1);
        addTag.addSouthEast(add);
      }
      else{
        this.tagToFactor.SE[0].removeNorthWest(this.tagToFactor.NW[0].NW[0]);
        if(this.tagToFactor.SE[0].NW.length + this.tagToFactor.SE[0].SE.length == 1){
          addTag.addSouthEast(this.tagToFactor.SE[0].NW[0]);
          this.tagToFactor.removeSouthEast(this.tagToFactor.SE[0]);
        }
        else if(this.tagToFactor.SE[0].NW.length + this.tagToFactor.SE[0].SE.length !== 0){
          addTag.addSouthEast(this.tagToFactor.SE[0]);
          this.tagToFactor.removeSouthEast(this.tagToFactor.SE[0]);
        }
        else{
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

  verify() {
    let dividend = this.tag.NW[0];
    return this.tag.orientation === Orientation.NS
        && divident.orientation === Orientation.EW
        && (dividend.NW.length+dividend.SE.length > 1)
        && this.tag.SE.length <= 1;
  }

  apply() {

    //create empty array to put split fractions
    let newNW = [];
    let newSE = [];
    let divisor = this.tag.SE;

    //Push the split fractions into their respective quadrants
    for (let child of this.tag.NW[0].NW) {
      newNW.push(new Tag(Orientation.NS, [child], divisor));
    }
    for(let child of this.tag.NW[0].SE) {
      newSE.push(new Tag(Orientation.NS, [child], divisor));
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

  verify() {
    if (tag.orientation !== Orientation.EW) {
      return false;
    }
    let divisor = tag.SE;
    for (let child of siblings) {
      if (child.SE !== divisor) {
        return false;
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

  verify() {
    return this.tag instanceof Tag
        && this.tag.parent !==null;
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
      parent.addSouthEast(this.tag);
      parent.removeNorthWest(this.tag);
    } else {
      parent.addNorthWest(this.tag);
      parent.removeSouthEast(this.tag);
    }

  }
}

//Canceling two siblings in opposite quadrants with equal value in a tag
class Cancel {
  constructor(sibling1, sibling2) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2
  }

  verify() {
    return this.sibling1.equals(this.sibling2)
        && this.sibling1.parent.equals(this.sibling2.parent);
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

  verify() {

  }

  apply() {
    //creating of the new child to add
    let copy;
    if (this.newChild instanceof Variable){
      copy = new Variable(this.newChild.value);
    } else {
      copy = new Literal(this.newChild.value);
    }

    //adding a children in both quadrants
    this.tag.addNorthWest(this.newChild);
    this.tag.addSouthEast(copy);
  }
}

class LiteralMerge{
  constructor(literalA, literalB, quadrantA, quadrantB){
    this.literalA = literalA;
    this.literalB = literalB;
    this.quadrantA = quadrantA;
    this.quadrantB = quadrantB;
  }

  verify(){
    if (this.literalA.parent !== this.literalB.parent)
      return false;
    if (this.literalA.parent.orientation == Orientation.EW)
      return true;
    if (this.quadrantA != this.quadrantB)
      return false;
    return false;
  }

  apply(){
    if(this.literalA.parent.orientation == Orientation.EW){
      if(this.quadrantA == Quadrant.NW){
        if(this.quadrantB == Quadrant.NW){
          this.literalA.value = (this.literalA.value + this.literalB.value) % 3;
          this.literalA.parent.removeNorthWest(this.literalB);
        }
        else{
          this.literalA.value = (this.literalA.value - this.literalB.value) % 3;
          this.literalA.parent.removeSouthEast(this.literalB);
        }
      }
      else if(this.quadrantB == Quadrant.NW){
        this.literalB.value = (this.literalB.value - this.literalA.value) % 3;
        this.literalB.parent.removeSouthEast(this.literalA);
      }
      else{
        this.literalA.value = Math.abs(-3 + (this.literalA.value - this.literalB.value) % 3);
        this.literalA.parent.removeSouthEast(this.literalB);
      }
    }
    else{
      this.literalA.value *= this.literalB.value;
      this.literalA.parent.removeNorthWest(this.literalB);
    }
  }
}
