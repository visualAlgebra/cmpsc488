function CSTest1() {
  var a = new Tag(Orientation.NS);
  a0 = new Literal(1);
  a1 = new Literal(2);
  a.addNorthWest(a0);
  a.addNorthWest(a1);

  var swapped = new CommutativeSwap(a0, a1, Quadrant.NW);
  swapped.apply();

  var equiv = new Tag(Orientation.NS);
  equiv.addNorthWest(a1);
  equiv.addNorthWest(a0);

  var retval = a.equals(equiv);
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

  var swapped = new CommutativeSwap(a1, a2, Quadrant.NW);
  swapped.apply();

  var equiv = new Tag(Orientation.NS);
  equiv.addNorthWest(a0);
  equiv.addNorthWest(a2);
  equiv.addNorthWest(a1);

  var retval = a.equals(equiv);
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

  var swapped = new CommutativeSwap(a2, a3, Quadrant.SE);
  swapped.apply();

  var equiv = new Tag(Orientation.EW);
  equiv.addNorthWest(a0);
  equiv.addSouthEast(a1);
  equiv.addSouthEast(a3);
  equiv.addSouthEast(a2);

  var retval = a.equals(equiv);
  if(!retval){
    console.log("CommutativeSwap Test 3 failed");
  }
  return retval;
}

function AMTest1() {
  // [ [1><] ><]
  // =>
  // [1><]
  var s = new Tag(Orientation.NS);
  s0 = new Literal(1);
  s1 = new Literal(2);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  var p = new Tag(Orientation.NS);
  p.addNorthWest(s);

  var merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  var retval = p.equals(s);
  if(!retval){
    console.log("AssociativeMerge Test 1 failed");
  }
  return retval;
}

function AMTest2() {
  // [s0 [ s0 s1 ><] >< s1]
  // =>
  // [s0 s0 s1 >< s1]
  var s = new Tag(Orientation.EW);
  s0 = new Literal(1);
  s1 = new Variable(2);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  var p = new Tag(Orientation.EW);
  p.addNorthWest(s0);
  p.addNorthWest(s);
  p.addSouthEast(s1);

  var merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  var equiv = new Tag(Orientation.EW);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s1);
  equiv.addSouthEast(s1);

  var retval = p.equals(equiv);
  if(!retval){
    console.log("AssociativeMerge Test 2 failed");
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


  var merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  var equiv = new Tag(Orientation.EW);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s0);
  equiv.addNorthWest(s1);
  equiv.addNorthWest(s2);
  equiv.addNorthWest(s3);
  equiv.addSouthEast(s2);
  equiv.addSouthEast(s3);
  equiv.addSouthEast(s1);

  var retval = p.equals(equiv);
  if(!retval){
    console.log("AssociativeMerge Test 3 failed");
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

  var merge = new AssociativeIntro(s, p, p.NW);
  var m = merge.apply();

  var equiv = new Tag(Orientation.NS, [p]);

  var retval = m.equals(equiv);
  if(!retval){
    console.log("AssociativeIntro Test 1 failed");
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

  var merge = new AssociativeIntro(s, p, p.NW);
  var m = merge.apply();

  var inner = new Tag(Orientation.NS, [p1, p2, p3]);
  var equiv = new Tag(Orientation.NS, [p0, inner]);

  var retval = m.equals(equiv);
  if(!retval){
    console.log("AssociativeIntro Test 2 failed");
  }
  return retval;
}

function AETest1() {
  const x = new Variable(1);

  const p = new Tag(Orientation.NS,
    [
      new Tag(Orientation.NS,
        [x, new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  console.log("P Before action:", p);

  const expected = new Tag(Orientation.NS,
    [
      new Variable(1),
      new Tag(Orientation.NS,
        [new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  console.log("Expected:", expected);

  const action = new AssociativeExtract(x, Quadrant.NW);
  action.apply()

  console.log("After action:", p);

  var retval = p.equals(expected);
  if(!retval){
    console.log("AssociativeExtract Test 1 failed");
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
  if(AETest1()) {
    console.log("All AssociativeExtract tests have passed");
  }
  if(AITest1()&&AITest2()) {
    console.log("All AssociativeIntro tests have passed");
  }
}

testAll();
