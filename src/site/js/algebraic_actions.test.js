function CSTest1() {
  var a = new Tag(Orientation.NS);
  a0 = new Literal(1);
  a1 = new Literal(2);
  a.addNorthWest(a0);
  a.addNorthWest(a1);

  var swapped = new CommutativeSwap(a0, a1, a.NW);
  var b = swapped.apply();

  var equiv = new Tag(Orientation.NS);
  equiv.addNorthWest(a1);
  equiv.addNorthWest(a0);

  var retval = b.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 1 failed");
  }
  return retval;
}

function CSTest2() {
  var a = new Tag(Orientation.NS);
  a0 = new Literal(1);
  a1 = new Variable(1);
  a2 = new Tag(Orientation.EW, [a0, a1]);
  a.addNorthWest(a0);
  a.addNorthWest(a1);
  a.addNorthWest(a2);

  var swapped = new CommutativeSwap(a1, a2, a.NW);
  var b = swapped.apply();

  var equiv = new Tag(Orientation.NS);
  equiv.addNorthWest(a0);
  equiv.addNorthWest(a2);
  equiv.addNorthWest(a1);

  var retval = b.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 2 failed");
  }
  return retval;
}


function CSTest3() {
  var a = new Tag(Orientation.EW);
  a0 = new Literal(1);
  a1 = new Variable(1);
  a2 = new Tag(Orientation.EW, [a0, a1]);
  a3 = new Tag(Orientation.NS, [a2, a1]);
  a.addNorthWest(a0);
  a.addSouthEast(a1);
  a.addSouthEast(a2);
  a.addSouthEast(a3);

  var swapped = new CommutativeSwap(a2, a3, a.SE);
  var b = swapped.apply();

  var equiv = new Tag(Orientation.EW);
  equiv.addNorthWest(a0);
  equiv.addSouthEast(a1);
  equiv.addSouthEast(a3);
  equiv.addSouthEast(a2);

  var retval = b.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 3 failed");
  }
  return retval;
}

function AMTest1() {
  var s = new Tag(Orientation.NS);
  s0 = new Literal(1);
  s1 = new Literal(2);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  var p = new Tag(Orientation.NS);
  p.addNorthWest(s);

  var merge = new AssociativeMerge(s, p, p.NW);
  var m = merge.apply();

  var retval = m.equals(s);
  if(!retval){
    console.log("CommutativeSwap Test 1 failed");
  }
  return retval;
}

function AMTest2() {
  var s = new Tag(Orientation.EW);
  s0 = new Literal(1);
  s1 = new Variable(2);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  var p = new Tag(Orientation.EW);
  p.addNorthWest(s0);
  p.addNorthWest(s);
  p.addSouthEast(s1);

  var merge = new AssociativeMerge(s, p, p.NW);
  var m = merge.apply();

  var equiv = new Tag(Orientation.EW);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s1);
  equiv.addSouthEast(s1);

  var retval = m.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 2 failed");
  }
  return retval;
}

function AMTest3() {
  var s = new Tag(Orientation.EW);
  s0 = new Literal(1);
  s1 = new Variable(2);
  s2 = new Variable(3);
  s3 = new Tag(Orientation.NS, [s0, s1], [s2]);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  s.addSouthEast(s2);
  s.addSouthEast(s3);

  var p = new Tag(Orientation.EW);
  p.addNorthWest(s0);
  p.addNorthWest(s);
  p.addNorthWest(s2);
  p.addNorthWest(s3);
  p.addSouthEast(s1);


  var merge = new AssociativeMerge(s, p, p.NW);
  var m = merge.apply();

  var equiv = new Tag(Orientation.EW);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s1);
  equiv.addNorthWest(s2);
  equiv.addNorthWest(s3);
  equiv.addSouthEast(s2);
  equiv.addSouthEast(s3);
  equiv.addSouthEast(s1);

  var retval = m.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 3 failed");
  }
  return retval;
}

function AITest1() {
  var p = new Tag(Orientation.NS);
  p0 = new Literal(1);
  p1 = new Literal(2);
  p.addNorthWest(p0);
  p.addNorthWest(p1);
  var s = [p0, p1];

  var merge = new AssociativeMerge(s, p, p.NW);
  var m = merge.apply();

  var equiv = new Tag(Orientation.NS, [p]);

  var retval = m.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 1 failed");
  }
  return retval;
}

function AITest2() {
  var p = new Tag(Orientation.NS);
  p0 = new Literal(1);
  p1 = new Literal(2);
  p2 = new Variable(3);
  p3 = new Tag(Orientation.EW, [p0], [p2]);
  p.addNorthWest(p0);
  p.addNorthWest(p1);
  p.addNorthWest(p2);
  p.addNorthWest(p3);
  var s = [p1, p2, p3];

  var merge = new AssociativeMerge(s, p, p.NW);
  var m = merge.apply();

  var inner = new Tag(Orientation.NS, [p1, p2, p3]);
  var equiv = new Tag(Orientation.NS, [p0, inner]);

  var retval = m.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 2 failed");
  }
  return retval;
}

function testAll() {
  if(CSTest1()&&CSTest2()&&CSTest3()){
    console.log("All CommutativeSwap tests have passed");
  }
  if(AMTest1()&&AMTest2()&&AMTest3()) {
    console.log("All AssociativeMerge tests have passed");
  }
  if(AITest1()&&AITest2()) {
    console.log("All AssociativeIntro tests have passed")
  }
}

testAll();
