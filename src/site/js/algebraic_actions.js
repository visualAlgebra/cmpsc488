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
import { Literal, Orientation, Quadrant, Tag, Variable } from "./expression_tree";

//TODO: Refactor to use remove, insert, and replace 
export class CommutativeSwap {

  constructor(sibling1, sibling2, quadrantLabel) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrantLabel = quadrantLabel;
    this.name = "Commutative Swap";
  }

  //verifys if the arguments are valid by checking
  //if the Siblings are in the same quadrant, then return true
  static verify(sibling1, sibling2, quadrant1, quadrant2) {
    return sibling1.parent !== null
      && sibling2.parent !== null 
      && quadrant1 !== null
      && quadrant2 !== null
      && !sibling1.is(sibling2)
      && quadrant1 === quadrant2
      && sibling1.parent.is(sibling2.parent);
  }

  //
  apply() {

    const parent = this.sibling1.parent;
    const temp = new Literal(-999);

    //Swapping the siblings
    parent.replace(this.sibling1, temp, this.quadrantLabel);
    parent.replace(this.sibling2, this.sibling1, this.quadrantLabel);
    parent.replace(temp, this.sibling2, this.quadrantLabel);
  }
}

// TODO: AssociativeMerge does not preserve order
//  [ 1 [2><] 3 ><]
//  [ 1 3 2 ><]

//Collapses the outer tag into the inner tag
export class AssociativeMerge {
  constructor(sibling, parent, quadrantLabel) {
    this.sibling = sibling;
    this.parent = parent;
    this.quadrantLabel = quadrantLabel; // The quadrant that `sibling` is in.
    this.name = "Associative Merge";
  }

  //verifys if the arguments are valid by checking
  //if the sibling is included in the parent
  //then return true
  static verify(sibling, parent) {
    return sibling instanceof Tag
      && parent instanceof Tag
      && sibling.parent !== null 
      && sibling.parent.is(parent)
      && (parent.orientation === sibling.orientation
        || (sibling.NW.length === 1 && sibling.SE.length === 0));
  }


  apply() {

    //Having pointers to quadrants of sibling
    let newNW;
    let newSE;
    if (this.quadrantLabel === Quadrant.NW) {
      newNW = this.sibling.NW;
      newSE = this.sibling.SE;
    } else {
      newNW = this.sibling.SE;
      newSE = this.sibling.NW;
    }
    this.parent.remove(this.sibling, this.quadrantLabel);

    //adding sibling's children into parent
    for (let child of newNW) {
      this.parent.insert(child, Quadrant.NW);
    }
    for (let child of newSE) {
      this.parent.insert(child, Quadrant.SE);
    }
  }
}

//Encloses a tag with another tag of the same orientation
export class AssociativeIntro {

  constructor(expr) {
    this.expr = expr;
    this.name = "Associative Introduction";
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
      if (parent.NW.some(thing => thing.is(this.expr))) {
        parent.replace(this.expr, newTag, Quadrant.NW);
      } else {
        parent.replace(this.expr, newTag, Quadrant.SE);
      }

      //add expr into new Tag
      newTag.insert(this.expr, Quadrant.NW);

    } else {

      if (this.expr instanceof Tag) {
        const copyNW = this.expr.NW;
        const copySE = this.expr.SE;
  
        //clear out expr
        this.expr.emptyNorthWest();
        this.expr.emptySouthEast();
  
        //if expr is a root tag,
        //make a copy of expr, newTag
        const newTag = new Tag(this.expr.orientation, copyNW, copySE);
  
        //add newTag into expr
        this.expr.insert(newTag, Quadrant.NW);

      } else {
        
        let newTag = new Tag(Orientation.NS);
        newTag.insert(this.expr, Quadrant.NW);

      }    

    }

  }
}

// Taking out a sibling from a tag and adding it into its grandparent
// TODO: Make this preserve order?
export class AssociativeExtract {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(grandchild, grandchildQuad, parentQuad) {
    this.grandchild = grandchild;
    this.grandChildQuad = grandchildQuad;
    this.parentQuad = parentQuad;
    this.name = "Associative Extraction";
  }

  static verify(grandchild, grandparent) {
    return grandparent instanceof Tag
      && grandparent !== null
      && grandchild.parent !== null
      && grandchild.parent.parent !== null
      && grandparent.is(grandchild.parent.parent)
      && grandchild.parent.orientation === grandparent.orientation;
  }

  apply() {

    //setting pointers to parent and grandparent
    let parent = this.grandchild.parent;
    const grandparent = parent.parent;
    const index = grandparent.find(parent, this.grandChildQuad);

    //removing grandchild from grandparent and prepending into parent
    parent.remove(this.grandchild, this.grandChildQuad);
    // console.log(parent);
    if (parent.treeCount === 1) {
      grandparent.remove(parent, this.parentQuad);
    }
    grandparent.insert(this.grandchild, grandparent.childQuadrant(parent), index);

  }
}

// [ x [ y >< z ] ><]
// =>
// [ [ x y >< z ] ><]
//Inserting a sibling into a sibling tag that has the same orientation as its parent
export class AssociativeInsert {

  // QuadrantLabel is the quadrant label of the parent that contains the child.
  constructor(sibling, insertionTag) {
    this.sibling = sibling;
    this.insertionTag = insertionTag;
    this.name = "Associative Insertion";
  }

  static verify(sibling, insertionTag, xQuad, yQuad) {
    return insertionTag instanceof Tag
      && sibling.parent !== null
      && sibling.parent.orientation === insertionTag.orientation
      && insertionTag.parent !== null
      && sibling.parent.is(insertionTag.parent)
      && !sibling.is(insertionTag)
      && xQuad === yQuad;
  }

  apply() {

    //setting pointer to parent
    const parent = this.sibling.parent;

    //removing pointer to sibling in parent
    parent.remove(this.sibling, parent.childQuadrant(this.sibling));

    //inserting sibling into intersion tag
    this.insertionTag.insert(this.sibling, Quadrant.NW, 0);
  }
}

export class Distribute {
  constructor(value, tagToDistributeOver) {
    this.value = value;
    this.tagToDistributeOver = tagToDistributeOver;
    this.name = "Distribution";
  }

  static verify(value, tagToDistributeOver, xQuad, yQuad) {
    if (!tagToDistributeOver instanceof Tag) {
      return false;
    }
    if (xQuad !== yQuad)
      return false;

    if (value.parent !== tagToDistributeOver.parent)
      return false;

    if (value.is(tagToDistributeOver))
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
        parent.insert(child, Quadrant.NW);
      }

      //clearing out the SE quadrant and adding in the new tags
      parent.emptySouthEast();
      for (let child of newSE) {
        parent.insert(child, Quadrant.SE);
      }
    } else {
      let quad = parent.childQuadrant(this.value);
      let index = parent.find(this.value, quad);
      parent.remove(this.value, Quadrant.NW);
      parent.remove(this.tagToDistributeOver, Quadrant.NW);
      let newTag = new Tag(Orientation.EW, newNW, newSE);
      parent.insert(newTag, quad, index);
    }

  }
}

export class Factor {
  constructor(valueToFactor, tagToFactor) {
    this.valueToFactor = valueToFactor;
    this.tagToFactor = tagToFactor;
    this.name = "Factorization";
  }

  static verify(valueToFactor, tagToFactor) {
    if (!tagToFactor instanceof Tag) {
      return false;
    }

    if (tagToFactor.orientation != Orientation.EW)
      return false;
    for (var i = 0; i < tagToFactor.NW.length; i++) {
      if (tagToFactor.NW[i] instanceof Tag) {
        if (!tagToFactor.NW[i].NW[0].equals(valueToFactor))
          return false;
      }
      else {
        if (!tagToFactor.NW[i].equals(valueToFactor))
          return false;
      }
    }

    for (var i = 0; i < tagToFactor.SE.length; i++) {
      if (tagToFactor.SE[i] instanceof Tag) {
        if (!tagToFactor.SE[i].NW[0].equals(valueToFactor))
          return false;
      }
      else {
        if (!tagToFactor.SE[i].equals(valueToFactor))
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
export class SplitFrac {
  constructor(tag) {
    this.tag = tag;
    this.name = "Fraction Split";
  }

  static verify(dividend, frac) {
    return dividend instanceof Tag
      && frac instanceof Tag
      && frac.orientation === Orientation.NS
      && dividend.orientation === Orientation.EW
      && dividend.parent !== null
      && frac.is(dividend.parent)
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
      this.tag.insert(child, Quadrant.NW);
    }
    this.tag.emptySouthEast();
    for (let child of newSE) {
      this.tag.insert(child, Quadrant.SE);
    }
  }
}

//Combine an EW tag of NS tags that have a common S quadrant
export class CombineFrac {
  //Where sibligns is the list of
  constructor(sibling1, sibling2, quadrantLabel) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrantLabel = quadrantLabel;
    this.name = "Fraction Combination";
  }

  static verify(sibling1, sibling2) {

    if (sibling1.is(sibling2)) {
      return false;
    }

    if (!(sibling1.parent !== null && sibling2.parent !== null)) {
      return false;
    }

    if (sibling1.parent.is(sibling2.parent)) {
      return false; 
    }

    if (!(sibling1 instanceof Tag && sibling2 instanceof Tag)) {
      return false; 
    }

    let divisor1 = sibling1.SE;
    let divisor2 = sibling2.SE;

    if (divisor1.length !== divisor2.length) {
      return false;
    }

    for(let i = 0; i < divisor1.length; i++) {
      if (!divisor1[i].equals(divisor2[i])) {
        return false;
      }
    }

  }

  apply() {

    let parent = this.sibling1.parent;
    let dividend = this.sibilng1.NW.concat(this.sibling2.NW);
    let divisor = this.sibling1.SE;


    
    let newFrac = new Tag(Orientation.NS, dividend, divisor);
    parent.replace(this.sibling2, newFrac, this.quadrantLabel);
    parent.remove(this.sibling1, this.quadrantLabel);

  }
}

// [x><]
// =>
// [><[><x]]
//x = 1/(1/x)
//x = -(-x)
//Flipping the NW and SE quadrants when a tag switches quadrants in its parent
export class QuadrantFlip {
  constructor(tag, quadrantLabel) {
    this.tag = tag;
    this.quadrantLabel = quadrantLabel;
    this.name = "Quadrant Flip";
  }

  static verify(tag, parent, xQuad, yQuad) {
    return tag instanceof Tag
      && parent !== null
      && tag.parent !== null
      && parent.is(tag.parent)
      && xQuad !== yQuad
      && tag.orientation === parent.orientation;
  }

  apply() {

    //Setting pointer to parent
    const parent = this.tag.parent;

    //Swapping quadrants
    const temp = this.tag.NW;
    this.tag.NW = this.tag.SE;
    this.tag.SE = temp;

    //Adding the tag into it's opposite quadrant;
    parent.remove(this.tag, this.quadrantLabel);
    let oppositeQuad = (this.quadrantLabel === Quadrant.NW) ? Quadrant.SE : Quadrant.NW;
    parent.insert(this.tag, oppositeQuad);

  }
}

//Canceling two siblings in opposite quadrants with equal value in a tag
export class Cancel {
  constructor(sibling1, sibling2) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.name = "Cancelation";
  }

  static verify(x, y, xQuad, yQuad) {
    return x.equals(y)
      && !x.is(y)
      && x.parent.is(y.parent)
      && xQuad !== yQuad;
  }

  apply() {

    //setting pointer to parent
    const parent = this.sibling2.parent;

    //removing the siblings
    parent.remove(this.sibling1, Quadrant.NW);
    parent.remove(this.sibling2, Quadrant.SE);
  }
}

//Adding two siblings of equal value into the top and bottom quadrants of a tag
//Only works with variables and literals
export class IdentityBalance {
  constructor(newChild, tag) {
    this.newChild = newChild;
    this.tag = tag;
    this.name = "Identity Balence";
  }

  static verify(newChild, tag) {
    if (!tag instanceof Tag) {
      return false;
    }
    if (tag.orientation == Orientation.NS) {
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
    this.tag.insert(this.newChild, Quadrant.NW);
    this.tag.insert(copy, Quadrant.SE);
  }
}

export class LiteralMerge {
  constructor(literalA, literalB, quadrantA, quadrantB) {
    this.literalA = literalA;
    this.literalB = literalB;
    this.quadrantA = quadrantA;
    this.quadrantB = quadrantB;
    this.name = "Literal Merging";
  }

  static verify(literalA, literalB, quadrantA, quadrantB) {
    if (literalA.parent !== literalB.parent)
      return false;
    if (!(literalA instanceof Literal && literalB instanceof Literal))
      return false;
    if (literalA.is(literalB))
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
        this.literalA.value = Math.abs((-3 + (-1 * (this.literalA.value + this.literalB.value))) % 3);
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

export class ZeroMerge {
  constructor(sibling1, sibling2) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.name = "Zero Merging";
  }

  static verify(sibling1, sibling2, quad1, quad2) {
    
    if (sibling1.is(sibling2)) {
      return false;
    }

    if (sibling1.parent !== sibling2.parent) {
      return false;
    }

    if (sibling1.parent.orientation !== Orientation.NS) {
      return false;
    }

    if (quad1 !== Quadrant.NW || quad2 !== Quadrant.NW) {
      return false;
    }

    return ((sibling1 instanceof Literal) && (sibling1.value == 0))
      || ((sibling2 instanceof Literal) && (sibling2.value == 0));

  }

  apply() {
    if (this.sibling1 instanceof Literal) {
      if (this.sibling1.value = 0)
        this.sibling1.parent.removeNorthWest(this.sibling2);
      else
        this.sibling2.parent.removeNorthWest(this.sibling1);
    }
    else
      this.sibling2.parent.removeNorthWest(this.sibling1)
  }
}

export class IdentityMerge {
  constructor(sibling1, sibling2, quadrant1, quadrant2) {
    this.sibling1 = sibling1;
    this.sibling2 = sibling2;
    this.quadrant1 = quadrant1;
    this.quadrant2 = quadrant2;
    this.name = "Identity Merging";
  }

  static verify(sibling1, sibling2, quadrant1, quadrant2) {

    if (sibling1.is(sibling2))
      return false;

    if (!(sibling1 instanceof Literal) && !(sibling2 instanceof Literal)) {
      return false;
    }

    if (sibling1.parent !== sibling2.parent)
      return false;
    if (sibling1.parent.orientation == Orientation.NS) {
      if (quadrant1 != Quadrant.NW || quadrant1 != quadrant2)
        return false;
      if (sibling1 instanceof Literal) {
        if (sibling1.value == 1)
          return true;
        if (sibling2 instanceof Literal)
          return sibling2.value == 1;
      }
      if (sibling2 instanceof Literal)
        return sibling2.value == 1;

      if (quadrant1 == Quadrant.NW && quadrant1 == quadrant2)
        return true;
      return false;
    }
    if (sibling1 instanceof Literal) {
      if (sibling1.value == 0)
        return true;
      if (sibling2 instanceof Literal)
        return sibling2.value == 0;
    }
    if (sibling2 instanceof Literal)
      return sibling2.value == 0;

    return false;
  }

  apply() {
    if (this.sibling1.parent.orientation == Orientation.NS)
      if (this.sibling1 instanceof Literal && this.sibling1.value == 1)
        this.sibling2.parent.removeNorthWest(this.sibling1);
      else
        this.sibling1.parent.removeNorthWest(this.sibling2);

    else {
      if (this.sibling1 instanceof Literal && this.sibling1.value == 0) {
        if (this.quadrant1 == Quadrant.NW)
          this.sibling2.parent.removeNorthWest(this.sibling1);
        else
          this.sibling2.parent.removeSouthEast(this.sibling1)
      }
      else {
        if (this.quadrant2 == Quadrant.NW)
          this.sibling1.parent.removeNorthWest(this.sibling2);
        else
          this.sibling1.parent.removeSouthEast(this.sibling2);
      }
    }
  }
}

export class LiteralConversion {
  constructor(literal, quad) {
    this.literal = literal;
    this.quad = quad;
    this.name = "Literal Conversion";
  }

  static verify(literal) {
    return (literal instanceof Literal);
  }

  apply() {
    if (this.literal.value == 0) {
      this.literal.parent.replace(this.literal, new Tag(Orientation.EW, [new Literal(1), new Literal(2)]), this.quad);
    }
    else if (this.literal.value == 1) {
      this.literal.parent.replace(this.literal, new Tag(Orientation.EW, [new Literal(2), new Literal(2)]), this.quad);
    }
    else {
      this.literal.parent.replace(this.literal, new Tag(Orientation.EW, [new Literal(1), new Literal(1)]), this.quad);
    }
  }
}
