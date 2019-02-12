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

  if(b.equals(equiv)){
    console.log("CommutativeSwap Test 1 passed");
  } else {
    console.log("CommutativeSwap Test 1 failed");
  }
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

  if(b.equals(equiv)){
    console.log("CommutativeSwap Test 2 passed");
  } else {
    console.log("CommutativeSwap Test 2 failed");
  }
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

  if(b.equals(equiv)){
    console.log("CommutativeSwap Test 3 passed");
  } else {
    console.log("CommutativeSwap Test 3 failed");
  }
}

function testAll() {
  CSTest1();
  CSTest2();
  CSTest3();
}

testAll();
