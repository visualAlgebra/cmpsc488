
const Orientation = {
  EW: "eastwest",
  NS: "northsouth"
}
// Abstract Class
class ExpressionTree {
  constructor(kind) {
    this.kind = kind;
    this.treeCount = 1;
    this.parent = null;
  }

  //equals(that) {
  //  if (Object.is(this, that)) return true;
  //  if (this.kind !== that.kind) return false;
  //}

  toString(){
    return "error";
  }
}

class Tag extends ExpressionTree {
  constructor(orientation, nw, se) {
    super("tag");
    this.orientation = orientation;
    this.NW = nw || [];
    this.SE = se || [];

    for (let child of this.NW) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
    for (let child of this.SE) {
      child.parent = this;
      this.treeCount += child.treeCount;
    }
  }

  updateParentTreeCount(count) {
    this.treeCount += count;
    if (this.parent != null) {
      this.parent.updateParentTreeCount(1);
    }
  }
  //
  addSouthEast(child) {
    this.SE.push(child);
    child.parent = this;
    this.updateParentTreeCount(1);
  }

  addNorthWest(child) {
    this.NW.push(child);
    child.parent = this;
    this.updateParentTreeCount(1);
  }

  equals(that) {
    if (that.kind === "tag") {
      if (this.orientation !== that.orientation
       || this.NW.length !== that.NW.length
       || this.SE.length !== that.SE.length) {
         return false;
      }

      for (let i = 0; i < this.NW.length; i++) {
        if (!this.NW[i].equals(that.NW[i])) return false;
      }

      for (let i = 0; i < this.SE.length; i++) {
        if (!this.SE[i].equals(that.SE[i])) return false;
      }

      return true;
    }else{
      return false;
    }
  }

  delete(ref) {
    array_delete(this.SE, ref);
    array_delete(this.NW, ref);
  }

  /** 
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render(p) {
    p.push();
    switch (this.orientation) {
      case Orientation.EW: {

        let leftWidth = 0;
        p.push();
        for (let i = this.NW.length - 1; i >= 0; i--) {
          let child = this.NW[i];
          const childWidth = child.dimensions().width;
          p.translate(-childWidth/2, 0);
          child.render(p);
          p.translate(-childWidth/2, 0);
          leftWidth += childWidth;
        }
        p.pop();

        let rightWidth = 0;
        p.push();
        for (let i = 0; i < this.SE.length; i++) {
          let child = this.SE[i];
          const childWidth = child.dimensions().width;
          p.translate(childWidth/2, 0);
          child.render(p);
          p.translate(childWidth/2, 0);
          rightWidth += childWidth;
        }
        p.pop();

        const height = this.dimensions().height;
        p.noFill();
        p.strokeWeight(5);
        p.stroke(0, 0, 255);
        p.rect(-leftWidth, -height/2, leftWidth, height);
        p.stroke(255, 0, 0);
        p.rect(0, -height/2, rightWidth, height);
        break;
      }

      case Orientation.NS: {

        let topHeight = 0;
        p.push();
        for (let i = this.NW.length - 1; i >= 0; i--) {
          let child = this.NW[i];
          const childHeight = child.dimensions().height;
          p.translate(0, -childHeight/2);
          child.render(p);
          p.translate(0, -childHeight/2);
          topHeight += childHeight;
        }
        p.pop();

        let bottomHeight = 0;
        p.push();
        for (let i = this.SE.length - 1; i >= 0; i--) {
          let child = this.SE[i];
          const childHeight = child.dimensions().height;
          p.translate(0, childHeight/2);
          child.render(p);
          p.translate(0, childHeight/2);
          bottomHeight += childHeight;
        }
        p.pop();

        const width = this.dimensions().width;
        p.noFill();
        p.strokeWeight(5);
        p.stroke(0, 0, 255);
        p.rect(-width/2, -topHeight, width, topHeight);
        p.stroke(255, 0, 0);
        p.rect(-width/2, 0, width, bottomHeight);
        break;
      }
    
      default:
        break;
    }
    p.pop();
  }

  dimensions() {
    switch (this.orientation) {
      case Orientation.EW: {
        const width = this.NW.reduce((acc, child) => acc + child.dimensions().width, 0)
                    + this.SE.reduce((acc, child) => acc + child.dimensions().width, 0) + 10;
        const height = Math.max(
          this.NW.reduce((acc, child) => Math.max(acc, child.dimensions().height), 0),
          this.SE.reduce((acc, child) => Math.max(acc, child.dimensions().height), 0)
        ) + 10;
        return {width, height};
      }

      case Orientation.NS: {
        const width = Math.max(
          this.NW.reduce((acc, child) => Math.max(acc, child.dimensions().width), 0),
          this.SE.reduce((acc, child) => Math.max(acc, child.dimensions().width), 0)
        ) + 10;
        const height = this.NW.reduce((acc, child) => acc + child.dimensions().height, 0)
                     + this.SE.reduce((acc, child) => acc + child.dimensions().height, 0) + 10;
        return {width, height};
      }
    
      default:
        break;
    }
  }

  toString(){
    var retval="{t"+(Object.keys(Orientation).find(key => Orientation[key] === this.orientation))+"{{";
    for (let i=0; i<this.NW.length; i++) {
      retval=retval+this.NW[i].toString();
      if(i!==this.NW.length-1){
        retval=retval+".";
      }
    }
    retval=retval+"}{";
    for (let i=0; i<this.SE.length; i++) {
      retval=retval+this.SE[i].toString();
      if(i!==this.SE.length-1){
        retval=retval+".";
      }
    }
    return retval+"}}}";
  }
}

function array_delete(arr, ref) {
  for (let i = 0; i < arr.length; i++) {
    if (Object.is(ref, arr[i])) {
      arr.splice(i, 1);
    }
  }
}
class Variable extends ExpressionTree {
  constructor(value) {
    super("variable");
    this.value = value;
  }

  equals(that) {
    if(that.kind!=="variable") return false;
    return this.value === that.value;
  }

  /** 
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render(p) {
    p.noStroke();
    p.fill(200, 0, 200);
    p.ellipse(0, 0, 50, 50);
    p.fill(255);
    p.textSize(30);
    p.text(`x${this.value}`, -15, 15);
  }

  dimensions() {
    return {
      width: 100,
      height: 100
    };
  }

  toString(){
    return "{v"+this.value+"}";
  }
}

class Literal extends ExpressionTree {
  constructor(value) {
    super("literal");
    this.value = value;
  }

  equals(that) {
    if(that.kind!=="literal") return false;
    return this.value === that.value;
  }

  /** 
   * Renders to a p5.js canvas.
   * @param {p5 sketch instance} p
   */
  render(p) {
    p.noStroke();
    p.fill(0, 200, 100);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 50, 50);
    p.fill(255);
    p.textSize(30);
    p.text(this.value, -15, 15);
  }

  dimensions() {
    return {
      width: 100,
      height: 100
    };
  }

  toString(){
    return "{l"+this.value+"}";
  }
}
//      {tEW{{tNS{{l2}{v1}}{}}{v2}}{}}
//      {tEW{{tNS{{l2}{v1}}{}}{v2}}{}}
//      {tEW{                         }}
//           {tNS{        }  }    }
//                {l2}{v1} {}
//                            {v2}
//      {tEW{,{{tNS{,{{l2}.{v1}}{},}}.{v2}}{},}}
//       tEW{,{{tNS{,{{l2}.{v1}}{},}}.{v2}}{},}
//           ,{{tNS{,{{l2}.{v1}}{},}}.{v2}}{},
//             {tNS{,{{l2}.{v1}}{},}} {v2}
//                 {,{{l2}.{v1}}{},}
//                   {{l2}.{v1}}{}
//                    {l2}.{v1}
function Deserialize(text){//eric
  if(text.substr(0,2)==="{l"){
    return new Literal(parseInt(text.substr(2,text.length-3)));
  }
  if(text.substr(0,2)==="{v"){
    return new Variable(parseInt(text.substr(2,text.length-3)));
  }
  if(text.substr(0,2)==="{t"){
    let orient=Orientation[text.substr(2,2)];
    let retval= new Tag(orient);


    let lastindex=text.lastIndexOf("}}");
  }
}

//function Deserialize_Depr(text){let retval; let tempstr=""; let indexval=0; let istag=false; let isEW=true; let isleft=true let isvar=false; let islit=false; for(let i=0; i<text.length; i++){ let char=text.charAt(i); if(char==="{"){ if(text.charAt(i+1)==="{"){ if(isEW){ } } } if(char==="}"){ if(isleft){ isleft=false; return; }else if(!isleft){ isleft=true; } if(isEW){ isEW=false; return; }else if(!isEW){ isEW=true; } } tempstr=tempstr+char; if(tempstr==="{t"||istag){ if(tempstr==="{t"){ istag=true; tempstr=""; continue; } if(char==="E"){ retval=new Tag(Orientation.EW); istag=false; isEW=true; i++; tempstr=""; }else if(char==="N"){ retval=new Tag(Orientation.NS); istag=false; isNS=true; i++; tempstr=""; }else{ throw "Error in deserialization with: "+text; } }else if(tempstr==="{v"){ while(char!=="}"){ indexval++; } //retval=new Variable() }else if(tempstr==="{l"){ } indexval=0; } }

function formatSerializationForConsole(serial_text){//eric
  let tempstr="";
  for(let i=0; i<serial_text.length; i++){
    char=serial_text.charAt(i);
    tempstr=tempstr+char;
  }
}
////////////////////////////////////////////////////////////////////////////////
var test_id_val=0;
function assert(left, right, value) {
  console.log("Testing set: "+(test_id_val++));
  console.log(left.toString());
  console.log(right.toString());
  console.log(left.equals(right));
  if (left.equals(right) !== value) throw "Bad assertion!";
}

// x4 + 0 - 2 - x1
let e1 = new Tag(Orientation.EW,
  [new Variable(4), new Literal(0)],
  [new Literal(2), new Variable(1)]
);

// (2 * x1) + x2
let e2 = new Tag(Orientation.EW,[
    new Tag(Orientation.NS,[new Literal(2), new Variable(1)], []),
    new Variable(2)
  ],
  []
);

let e3=new Tag(Orientation.EW,[new Literal(2),new Variable(3)]);

let h1 = new Tag(Orientation.EW);
h1.addNorthWest(new Variable(4));
h1.addNorthWest(new Literal(0));
h1.addSouthEast(new Literal(2));
h1.addSouthEast(new Variable(1));

let h2 = new Tag(Orientation.EW);
let v = new Tag(Orientation.NS);
h2.addNorthWest(v)
v.addNorthWest(new Literal(2));
v.addNorthWest(new Variable(1));
h2.addNorthWest(new Variable(2));

let h3=new Tag(Orientation.EW);
h3.addNorthWest(new Literal(2));
h3.addNorthWest(new Variable(3));

assert(e1,h1, true);
assert(e2,h2, true);
assert(e3,h3, true);
