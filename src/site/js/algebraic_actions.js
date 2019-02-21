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

    const quadrant = this.sibling1.parent[this.quadrantLabel];

    //Finds the index of the two siblings
    var idx1 = quadrant.findIndex(x => Object.is(x, this.sibling1));
    var idx2 = quadrant.findIndex(x => Object.is(x, this.sibling2));

    //create a new array for the return tree
    var newQuadrant = [];

    //constructs the the array,
    //if i matches one of the indices of the siblings,
    //then the other sibling will be added
    for (var i = 0; i < quadrant.length; i++) {
      if (i === idx1) {
        newQuadrant[i] = this.sibling2;
      } else if (i === idx2) {
        newQuadrant[i] = this.sibling1;
      } else {
        newQuadrant[i] = quadrant[i];
      }
    }

    //if quadrant was NW, then replace NW, else replace SE
    if (this.quadrantLabel === Quadrant.NW) {
      this.sibling1.parent.NW = newQuadrant;
    } else {
      this.sibling1.parent.SE = newQuadrant;
    }
  }
}

// (1 + 2) + 1 => 1 + 2 + 1

// (1 - 2) + 1 => (1 + 1 - 2)

// APPLY ASSOCIATIVE MERGE
// [ [1><2] 1 ><]
//                        Apply AssociativeMerge.
// [ 1 1 >< 2 ]

// APPLY ASSOCIATIVE INTRO
// [1 2 >< 1]
//                       Apply AssociativeIntro.
// [ [1 2 >< 1] ><]

// APPLY ASSOCIATIVE INTRO
// 1
//                       Apply AssociativeIntro.
// [ 1 ><]

// APPLY ASSOCIATIVE INTRO
// [1 2 >< 1]
//                       Apply AssociativeIntro.
// [ [1><] 2 >< 1]

// UNDO ASSOCIATIVE MERGE
// [ 1 1 >< 2 ]
//                        Enclose entire tag in tag of same orientation.
// [ [1 1><2] ><]
//                        Apply new kind of AssociativeIntro.
// [ [ 1 [1><2] ><] ><]
//                        Merge outer two tags.
// [ 1 [1><2] ><]
//                        Apply a commutative swap.
// [ [1><2] 1 ><]

// CRAZY ASSOCIATIVE INTRO
// [1 2 >< 3]  <=Merge=  [1 [2><3] ><]
//
// [1 [2><] >< 3]
//
// [1 [2><] >< [3><]]
//
// [1 [2><3] ><]


//Takes two tags of the same orientation and one is in the other.
//The inner tag is collapsed into the outer tag
class AssociativeMerge {
  constructor(sibling, parent, quadrantLabel) {
    this.sibling = sibling;
    this.parent = parent;
    this.quadrantLabel = quadrantLabel;
  }

  //verifys if the arguments are valid by checking
  //if the sibling is included in the parent
  //then return true
  verify() {
    return this.parent.NW.includes(this.sibling)
        || (this.parent.SE.includes(this.sibling) && this.parent.orientation === Orientation.EW);
  }


  apply() {

    const quadrant = this.parent[this.quadrantLabel];

    //make a new array for new tree
    var newQuadrantNW = [];
    var newQuadrantSE = [];

    // If the sibling is in the NW quadrant...
    if (this.quadrantLabel === Quadrant.NW) {

      //add expressions into new quadrant
      for(let child of quadrant) {

        if(Object.is(child, this.sibling)) {

          for(let siblingChildNW of child.NW) {
            newQuadrantNW.push(siblingChildNW);
          }

          for(let siblingChildSE of child.SE) {
            newQuadrantSE.push(siblingChildSE);
          }

        } else {
          newQuadrantNW.push(child);
        }
      }

      // Add everything from the parent's SE quadrant into the new SE quadrant.
      for(let child of this.parent.SE) {
        newQuadrantSE.push(child);
      }

    } else { // SE quadrant

      // Add everything from the parent's NW quadrant into the new NW quadrant.
      for(let child of this.parent.NW) {
        newQuadrantNW.push(child);
      }

      //add expressions into new quadrant
      for(let child of quadrant) {

        if(Object.is(child, this.sibling)) {

          for(let siblingChildNW of child.NW) {
            newQuadrantSE.push(siblingChildNW);
          }

          for(let siblingChildSE of child.SE) {
            newQuadrantNW.push(siblingChildSE);
          }

        } else {
          newQuadrantSE.push(child);
        }
      }
    }

    this.parent.NW = newQuadrantNW;
    this.parent.SE = newQuadrantSE;
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
      const newTag = new Tag(parent.orientation);
      newTag.parent = parent;
      newTag.addNorthWest(this.expr);
      if (parent.NW.includes(this.expr)) {
        parent.findAndReplace(this.expr, newTag, Quadrant.NW);
      } else {
        parent.findAndReplace(this.expr, newTag, Quadrant.SE);
      }
    } else {
      const newTag = new Tag(this.expr.orientation, this.expr.NW, this.expr.SE);
      this.expr.emptyNorthWest();
      this.expr.emptySouthWest();
      this.expr.addNorthWest(newTag);
    }

  }
}

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
    const parent = this.grandchild.parent;
    const grandparent = parent.parent;

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
    const parent = this.sibling.parent;

    this.insertionTag.prependNorthWest(this.sibling);
    if (parent.NW.includes(this.sibling)) {
      parent.removeNorthWest(this.sibling);
    } else {
      parent.removeSouthEast(this.sibling);
    }
  }
}

class Distribute {
  constructor(parent, value, tagToDistributeOver, startIndx) {
    this.parent = parent;
    this.value = value;
    this.tagToDistributeOver = tagToDistributeOver;
    this.startIndx = startIndx;
  }

  verify() {
    // return this.sibling1 and this.sibling2 are actually siblings;
  }

  apply() {
    for(var i = 0; i<tagToDistributeOver.NW.length; i++){
      if(!tagToDistributeOver.NW[i] instanceof Tag){
        var multTag = Tag("northsouth");
        prependNorthWest(tagToDistributeOver.NW[i]);
        prependNorthWest(value);
        tagToDistributeOver.parent = multTag;
      }
      else{
        if (tagToDistributeOver.NW[i].orientation == "northsouth")
          tagToDistributeOver.NW[i].prependNorthWest(value);
        else{
          var multTag = Tag("northsouth");
          prependNorthWest(tagToDistributeOver.NW[i]);
          prependNorthWest(value);
          tagToDistributeOver.parent = multTag;
        }
      }
    }
    parent.splice(startIndx, 2, multTag);

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
    var tagToFactorNWlength = this.tagToFactor.NW.length;
    for(var i = 0; i<tagToFactorNWlength; i++){
      if ((this.tagToFactor.NW[0] instanceof Variable) || (this.tagToFactor.NW[0] instanceof Literal)){
        this.tagToFactor.removeNorthWest(this.tagToFactor.NW[0]);
        addTag.addNorthWest(new Literal(1));
      }
      else{
        this.tagToFactor.NW[0].removeNorthWest(this.valueToFactor);
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
        this.tagToFactor.SE[0].removeNorthWest(this.valueToFactor);
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
    this.tag.emptySouthWest();
    for (let child of newSE) {
      this.tag.addSouthEast(child);
    }
  }
}

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

    let newNW = [];
    let newSE = [];
    let divisor = [];
    for (let child of this.tag.NW) {
      newNW = newNW.concat(child.NW);
      divisor = child.SE;
    }
    for (let child of this.tag.SE) {
      newSE = newSE.concat(child.NW);
      divisor = child.SE;
    }

    let dividend = new Tag(Orientation.EW, newNW, newSE);
    this.tag.orientation = Orientation.NS;
    this.tag.emptyNorthWest();
    this.tag.addNorthWest(dividend);
    this.tag.emptySouthWest();
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
//TODO: get a better name for this.
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

    //
    const parent = this.tag.parent;

    //Swapping quadrants
    const temp = this.tag.NW;
    this.tag.NW = this.tag.SE;
    this.tag.SE = temp;

    if (this.quadrantLabel === Quadrant.NW) {
      parent.addSouthEast(this.tag);
      parent.removeNorthWest(this.tag);
    } else {
      parent.addNorthWest(this.tag);
      parent.removeSouthEast(this.tag);
    }

  }
}

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
    const parent = this.sibling2.parent;

    parent.removeNorthWest(this.sibling1);
    parent.removeSouthEast(this.sibling2);
  }
}

class IdentityBalance {
  constructor(sibling) {
    this.sibling = sibling;
  }

  verify() {
    // return this.sibling1 and this.sibling2 are actually siblings;
  }

  apply() {

  }
}
