
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
      case Orientation.EW:
        this.NW.forEach((child, i) => {
          p.push();
          p.translate(-i * (100 + 10) - 50, 0);
          child.render(p);
          p.pop();
        });
        this.SE.forEach((child, i) => {
          p.push();
          p.translate(i * (100 + 10) + 50, 0);
          child.render(p);
          p.pop();
        });
        break;

      case Orientation.NS:
        this.NW.forEach((child, i) => {
          p.push();
          p.translate(0, -i * (100 + 10) - 50);
          child.render(p);
          p.pop();
        });
        this.SE.forEach((child, i) => {
          p.push();
          p.translate(0, i * (100 + 10) + 50);
          child.render(p);
          p.pop();
        });
        break;

      default:
        break;
    }
    p.pop();
  }
  toString(){
    var retval="{t"+(Object.keys(Orientation).find(key => Orientation[key] === this.orientation))+"{{";
    for (let i=0; i<this.NW.length; i++) {
      retval=retval+this.NW[i].toString();
    }
    retval=retval+"}{";
    for (let i=0; i<this.SE.length; i++) {
      retval=retval+this.SE[i].toString();
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
//      {tEW{{{tNS{{{l2}{v1}}{{l4}}}}{v2}}{}}}
//       tEW{{{tNS{{{l2}{v1}}{{l4}}}}{v2}}{}}
//           {{tNS{{{l2}{v1}}{{l4}}}}{v2}}{}
//            {tNS{{{l2}{v1}}{{l4}}}}{v2}
//             tNS{{{l2}{v1}}{{l4}}}
//                 {{l2}{v1}}{{l4}}
//                  {l2}{v1}  {l4}
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
    let firstindex=text.indexOf("{{")+1;
    let lastindex=text.length-2;
    //helper(text.substr(firstindex,lastindex-firstindex));
    let midindex=0;
    let counter=0;
    for(let i=firstindex; i<text.length; i++){
      if(text.charAt(i)==="{"){
        counter++;
      }else if(text.charAt(i)==="}"){
        counter--;
        if(counter===0){
          midindex=i;
          break;
        }
      }
    }
    let t1=text.substr(firstindex,midindex-firstindex+1);
    //helper(t1);
    let tempstr="";
    if(t1!=="{}"){
      for(let i=firstindex+1; i<midindex; i++){
        tempstr=tempstr+text.charAt(i);
        if(text.charAt(i)==="{"){
          counter++;
        }else if(text.charAt(i)==="}"){
          counter--;
          if(counter===0){
            //helper(tempstr);
            let d=Deserialize(tempstr);
            retval.addNorthWest(d);
            tempstr="";
          }
        }
      }
    }
    let t2=text.substr(midindex+1,lastindex-midindex-1);
    //helper(t2);
    tempstr="";
    if(t2!=="{}"){
      for(let i=midindex+2; i<lastindex-1; i++){
        tempstr=tempstr+text.charAt(i);
        if(text.charAt(i)==="{"){
          counter++;
        }else if(text.charAt(i)==="}"){
          counter--;
          if(counter===0){
            //helper(tempstr);
            let d=Deserialize(tempstr);
            retval.addSouthEast(d);
            tempstr="";
          }
        }
      }
    }
    return retval;
  }
}
function helper(text){
  let rettext="";
  let temp=0;
  let zeroamt=0;
  let i=0;
  for(i=0; i<text.length; i++){
    if(text.charAt(i)==="{"){
      temp++;
      rettext=rettext+(temp).toString();
    }else if(text.charAt(i)==="}"){
      rettext=rettext+(temp).toString();
      temp--;
      if(temp===0){
        zeroamt++;
      }
    }else{
      rettext=rettext+" ";
    }
  }
  //console.log(text);
  //console.log(rettext+"  :  "+(temp===0)+"  :  "+zeroamt);
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
  if(typeof left==="string"){
    console.log(left===right);
    if((left===right)!==value) throw "Bad assertion!";
  }else{
    console.log(left.equals(right));
    if (left.equals(right) !== value) throw "Bad assertion!";
  }
}

// x4 + 0 - 2 - x1
let e1 = new Tag(Orientation.EW,
  [new Variable(4), new Literal(0)],
  [new Literal(2), new Variable(1)]
);

// (2 * x1) + x2
let e2 = new Tag(Orientation.EW,[
    new Tag(Orientation.NS,[new Literal(2),new Literal(8), new Variable(1), new Variable(3)], [new Literal(4)]),
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
v.addNorthWest(new Literal(8));
v.addNorthWest(new Variable(1));
v.addNorthWest(new Variable(3));
v.addSouthEast(new Literal(4));
h2.addNorthWest(new Variable(2));

let h3=new Tag(Orientation.EW);
h3.addNorthWest(new Literal(2));
h3.addNorthWest(new Variable(3));

assert(e1,h1, true);
assert(e2,h2, true);
assert(e3,h3, true);
assert(e1.toString(),h1.toString(),true);
assert(e2.toString(),h2.toString(),true);
assert(e3.toString(),h3.toString(),true);
assert(Deserialize(e1.toString()),h1,true);
assert(Deserialize(h1.toString()),e1,true);
assert(Deserialize(e2.toString()),h2,true);
assert(Deserialize(h2.toString()),e2,true);
assert(Deserialize(e3.toString()),h3,true);
assert(Deserialize(h3.toString()),e3,true);