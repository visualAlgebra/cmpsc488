//Setting Literals and Variables for unit testing
const v1 = new Variable(1);
const v2 = new Variable(2);
const v3 = new Variable(3);
const v4 = new Variable(4);
const v5 = new Variable(5);
const l1 = new Literal(1);
const l2 = new Literal(2);
const l3 = new Literal(3);

function assertAA (applied, expected, err) {
  let retval = applied.equals(expected);
  if(!retval) {
    console.log("Applied:", applied);
    console.log("Expected:", expected);
    console.log(err);
  }
  return retval;
}

function allPassed (action) {
  console.log("All " + action + " tests have passed");
}

function negative(x) {
  x = new Tag(Orientation.EW, [],[x]);
  return x;
}

function CSTest1 () {
  let a = new Tag(Orientation.NS);
  let a0 = new Literal(1);
  let a1 = new Literal(2);
  a.addNorthWest(a0);
  a.addNorthWest(a1);

  let swapped = new CommutativeSwap(a0, a1, Quadrant.NW);
  swapped.apply();

  let expected = new Tag(Orientation.NS);
  expected.addNorthWest(new Literal(2));
  expected.addNorthWest(new Literal(1));

  return assertAA(a, expected, "CommutativeSwap Test 1 failed");
}

function CSTest2() {
  let a = new Tag(Orientation.NS);
  let a0 = new Literal(1);
  let a1 = new Variable(1);
  let a2 = new Tag(Orientation.EW, [new Literal(2), new Variable(2)]);
  a.addNorthWest(a0);
  a.addNorthWest(a1);
  a.addNorthWest(a2);

  let swapped = new CommutativeSwap(a1, a2, Quadrant.NW);
  swapped.apply();

  let expected = new Tag(Orientation.NS);
  expected.addNorthWest(new Literal(1));
  expected.addNorthWest(new Tag(Orientation.EW, [new Literal(2), new Variable(2)]));
  expected.addNorthWest(new Variable(1));

  return assertAA(a, expected, "CommutativeSwap Test 2 failed");
}


function CSTest3() {
  let a = new Tag(Orientation.EW);
  let a0 = new Literal(1);
  let a1 = new Variable(1);
  let a2 = new Tag(Orientation.EW, [new Variable(2), new Variable(3)]);
  let a3 = new Tag(Orientation.NS, [new Literal(2), new Literal(3)]);
  a.addNorthWest(a0);
  a.addSouthEast(a1);
  a.addSouthEast(a2);
  a.addSouthEast(a3);

  let swapped = new CommutativeSwap(a2, a3, Quadrant.SE);
  swapped.apply();

  let expected = new Tag(Orientation.EW);
  expected.addNorthWest(new Literal(1));
  expected.addSouthEast(new Variable(1));
  expected.addSouthEast(new Tag(Orientation.NS, [new Literal(2), new Literal(3)]));
  expected.addSouthEast(new Tag(Orientation.EW, [new Variable(2), new Variable(3)]));

  return assertAA(a, expected, "CommutativeSwap Test 3 failed");
}

function AMTest1() {
  // [ [1><] ><]
  // =>
  // [1><]
  let s = new Tag(Orientation.NS);
  let s0 = new Literal(1);
  let s1 = new Literal(2);
  s.addNorthWest(s0);
  s.addNorthWest(s1);
  let p = new Tag(Orientation.NS);
  p.addNorthWest(s);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  const expected = new Tag(Orientation.NS, [new Literal(1), new Literal(2)]);

  return assertAA(p, expected, "AssociativeMerge Test 1 failed");
}

function AMTest2() {

  let s = new Tag(Orientation.EW);
  let s0 = new Literal(1);
  let s1 = new Literal(2);
  let s2 = new Variable(1);
  s.addSouthEast(s0);
  s.addSouthEast(s1);
  s.addSouthEast(s2);
  let p = new Tag(Orientation.EW);
  p.addNorthWest(s);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  let expected = new Tag(Orientation.EW,
    [],
    [new Literal(1),new Literal(2),new Variable(1)]);

  return assertAA(p, expected, "AssociativeMerge Test 2 failed");
}

function AMTest3() {

  let s = new Tag(Orientation.NS);
  let s0 = new Literal(1);
  let s1 = new Literal(2);
  let s2 = new Variable(1);
  let s3 = new Tag(Orientation.EW, [new Variable(6), new Literal(2), new Literal(1)]);
  s.addSouthEast(s0);
  s.addSouthEast(s1);
  s.addSouthEast(s2);
  s.addSouthEast(s3);
  let p = new Tag(Orientation.NS);
  p.addNorthWest(s);

  let merge = new AssociativeMerge(s, p, Quadrant.NW);
  merge.apply();

  let expected = new Tag(Orientation.NS,
    [],
    [
      new Literal(1),
      new Literal(2),
      new Variable(1),
      new Tag(Orientation.EW, [new Variable(6), new Literal(2), new Literal(1)])
    ]
  );

  return assertAA(p, expected, "AssociativeMerge Test 3 failed");
}

function AITest1() {
  var p = new Tag(Orientation.NS);
  let p0 = new Literal(1);
  let p1 = new Literal(2);
  p.addNorthWest(p0);
  p.addNorthWest(p1);

  let intro = new AssociativeIntro(p);
  intro.apply();

  let expected = new Tag(Orientation.NS,
    [new Tag(Orientation.NS, [new Literal(1), new Literal(2)])]
  );

  return assertAA(p, expected, "AssociativeIntro Test 1 failed");
}

function AITest2() {

  let p = new Tag(Orientation.NS);
  let p0 = new Variable(1);
  let p1 = new Literal(2);
  p.addSouthEast(p0);
  p.addSouthEast(p1);

  let intro = new AssociativeIntro(p);
  intro.apply();

  let expected = new Tag(Orientation.NS, [new Tag(Orientation.NS,
    [],
    [new Variable(1), new Literal(2)])]);

  return assertAA(p, expected, "AssociativeIntro Test 2 failed");
}

function AITest3() {
  const before = new Tag(Orientation.NS, [v1, v2, l1], [l2]);

  const expected = new Tag(Orientation.NS,
    [
      new Variable(1),
      new Tag(Orientation.NS, [new Variable(2)]),
      new Literal(1)
    ],
    [new Literal (2)]
  );

  const action = new AssociativeIntro(v2);
  action.apply();

  return assertAA(before, expected, "AssociativeIntro Test 3 failed");
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

  const action = new AssociativeExtract(x, Quadrant.NW);
  action.apply()

  return assertAA(p, expected, "AssociativeExtract Test 1 failed");
}

function AETest2() {
  const x = new Variable(1);

  //[v2 x l1>< l2 l3]
  const s = new Tag(Orientation.EW,
    [
      new Variable(2),
      x,
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  //[v3><s]
  const p = new Tag(Orientation.EW, [new Variable(3)], [s]);

  const action = new AssociativeExtract(x, Quadrant.SE);
  action.apply();

  const expectedSibling = new Tag(Orientation.EW,
    [
      new Variable(2),
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  const expectedParent = new Tag(Orientation.EW, [new Variable(3)], [new Variable(1), s]);

  return assertAA(p, expectedParent, "AssociativeExtract test 2 failed");
}

function AInsTest1() {
  const x = new Variable(1);
  const inner =   new Tag(Orientation.NS,
      [new Variable(2)],
      [new Variable(3)]
  );

  const before = new Tag(Orientation.NS,
    [x, inner],
    []
  );

  const expected = new Tag(Orientation.NS,
    [
      new Tag(Orientation.NS,
        [new Variable(1), new Variable(2)],
        [new Variable(3)]
      )
    ],
    []
  );

  const action = new AssociativeInsert(x, inner);
  action.apply()

  return assertAA(before, expected, "AssociativeInsert Test 1 failed");
}

function AInsTest2() {

  const x = new Variable(1);

  const inner = new Tag(Orientation.EW,
    [
      new Variable(2),
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  const before = new Tag(Orientation.EW, [new Variable(3)], [inner, x]);

  //[x v2 l1>< l2 l3]
  const innerExpected = new Tag(Orientation.EW,
    [
      new Variable(1),
      new Variable(2),
      new Literal(1)
    ],
    [
      new Literal(2),
      new Literal(3)
    ]);

  //[v3><s]
  const expected = new Tag(Orientation.EW, [new Variable(3)], [innerExpected]);

  const action = new AssociativeInsert(x, inner);
  action.apply();

  return assertAA(before, expected, "AssociativeInsert test 2 failed");
}

function AInsTest3() {

  const t1 = new Tag(Orientation.NS, [l1], [l2]);
  const t2 = new Tag(Orientation.NS, [l3]);
  //[v1 v2 [l1 l2><] [l3><] >< v4]
  const before = new Tag(Orientation.NS, [v1, v2, t1, t2], [v4]);

  const inner = new Tag(Orientation.NS,
    [
      new Tag(Orientation.NS, [new Literal(1)], [new Literal(2)]),
      new Literal(3)
    ]
  );
  //[v1 v2 [ [l1 l2><] l3><] >< v4]
  const expected = new Tag(Orientation.NS,
    [
      new Variable(1),
      new Variable(2),
      inner
    ],
    [
      new Variable(4)
    ]
  );

  const action = new AssociativeInsert(t1, t2);
  action.apply();

  return assertAA(before, expected, "AssociativeInsert test 3 failed");
}

function DTest1() {

  const inner = new Tag(Orientation.EW);
  let i1 = new Variable(1);
  let i2 = new Variable(2);
  inner.addNorthWest(i1);
  inner.addNorthWest(i2);

  const factor = new Literal(1);
  const before = new Tag(Orientation.NS, [factor, inner]);

  const expected = new Tag(Orientation.EW,
   [
     new Tag( Orientation.NS, [new Literal(1), new Variable(1)]),
     new Tag( Orientation.NS, [new Literal(1), new Variable(2)])
   ]);

   const action = new Distribute(factor, inner);
   action.apply();

   return assertAA(before, expected, "Distribute test 1 failed");
}

function DTest2() {

  //[v3, l1 >< l2]
  const x = new Tag(Orientation.NS, [v3, l1], [l2])
  //[v1, v2, x, l3 >< ]
  const inner = new Tag(Orientation.EW, [v1, v2, x, l3]);

  const factor = new Variable(4);

  const before = new Tag(Orientation.NS, [factor, inner]);

  const expected = new Tag(Orientation.EW, [
    new Tag(Orientation.NS, [new Variable(4), new Variable(1)]),
    new Tag(Orientation.NS, [new Variable(4), new Variable(2)]),
    new Tag(Orientation.NS, [new Variable(4), new Tag(Orientation.NS, [v3, l1], [l2])]),
    new Tag(Orientation.NS, [new Variable(4), new Literal(3)])
  ]);

  const action = new Distribute(factor, inner);
  action.apply();

  return assertAA(before, expected, "Distribute test 2 failed");
}

function DTest3() {

  const inner = new Tag(Orientation.EW, [v1, v2, l1], [l2, v3]);

  const factor = new Tag(Orientation.EW, [v4], [l3]);

  const before = new Tag(Orientation.NS, [factor, inner]);

  const expected = new Tag(Orientation.EW,
  [
    new Tag(Orientation.NS, [new Tag(Orientation.EW, [v4], [l3]), new Variable(1)]),
    new Tag(Orientation.NS, [new Tag(Orientation.EW, [v4], [l3]), new Variable(2)]),
    new Tag(Orientation.NS, [new Tag(Orientation.EW, [v4], [l3]), new Literal(1)])
  ],
  [
    new Tag(Orientation.NS, [new Tag(Orientation.EW, [v4], [l3]), new Literal(2)]),
    new Tag(Orientation.NS, [new Tag(Orientation.EW, [v4], [l3]), new Variable(3)])
  ]);

  const action = new Distribute(factor, inner);
  action.apply();

  return assertAA(before, expected, "Distribute test 3 failed");
}

function FTest1() {

  const factor = new Literal(4);

  const before = new Tag(Orientation.EW,
    [
      new Tag(Orientation.NS, [new Literal(4), v1]),
      new Tag(Orientation.NS, [new Literal(4), v2])
    ]);

  const t1 = new Tag(Orientation.EW, [new Variable(1), new Variable(2)]);
  const expected = new Tag(Orientation.NS,
    [
      new Literal(4),
      new Tag(Orientation.EW, [new Variable(1), new Variable(2)])
    ]
  );

  const action = new Factor(factor, before);
  action.apply();
  return assertAA(before, expected, "Factor test 1 failed\n");
}

function FTest2() {

  let factor = new Variable(4);

  //[v3, l1 >< l2]
  const x = new Tag(Orientation.NS, [v3, l1], [l2]);

  const before = new Tag(Orientation.EW, [
    new Tag(Orientation.NS, [new Literal(4), new Variable(1)]),
    new Tag(Orientation.NS, [new Literal(4), new Variable(2)]),
    new Tag(Orientation.NS, [new Literal(4), x]),
    new Tag(Orientation.NS, [new Literal(4), new Literal(3)])
  ]);

  //[v1, v2, x, l3 >< ]
  const inner = new Tag(Orientation.EW,
    [
      new Variable(1),
      new Variable(2),
      new Tag(Orientation.NS, [new Variable(3), new Literal(1)], [new Literal(2)]),
      new Literal(3)
    ]
  );

  const expected = new Tag(Orientation.NS, [new Variable(4), inner]);

  const action = new Factor(factor, before);
  action.apply();

  return assertAA(before, expected, "Factor test 2 failed");
}

function FTest3() {

  const factor = new Literal(4);

  const before = new Tag(Orientation.EW,
    [
      new Tag(Orientation.NS, [new Literal(4), new Variable(1)]),
      new Tag(Orientation.NS, [new Literal(4)])
    ]);

  const t1 = new Tag(Orientation.EW,
    [new Variable(1), new Literal(1)]);
  const expected = new Tag(Orientation.NS, [factor, t1]);

  const action = new Factor(factor, before);
  action.apply();

  return assertAA(before, expected, "Factor test 3 failed");
}

function FTest4() {

  const factor = new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2)]);

  //Going to look back at this and have no idea what I did here
  const before = new Tag(Orientation.EW,
    [
      new Tag(Orientation.NS,
        [
          new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2)]),
          new Variable(3)
        ]
      ),
      new Tag(Orientation.NS,
        [
          new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2)]),
          new Variable(4),
          new Literal(2)
        ]
      ),
      new Tag(Orientation.NS,
        [
          new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2)]),
          new Variable(5),
          new Variable(6)
        ]
      )
    ],
    [
      new Tag(Orientation.NS,
        [
          new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2)]),
          new Variable(7)
        ]
      ),
      new Tag(Orientation.NS,
        [
          new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2)]),
          new Variable(8),
          new Tag(Orientation.EW, [new Literal(1), new Variable(9)])
        ]
      )
    ]
  );

  const expected = new Tag(Orientation.NS,
    [
      new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2)]),
      new Tag(Orientation.EW,
        [
          new Variable(3),
          new Tag(Orientation.NS,
            [
              new Variable(4),
              new Literal(2)
            ]
          ),
          new Tag(Orientation.NS,
            [
              new Variable(5),
              new Variable(6)
            ]
          )
        ]
      )
    ],
    [
      new Variable(7),
      new Tag(Orientation.NS,
        [
          new Variable(8),
          new Tag(Orientation.EW, [new Literal(1), new Variable(9)])
        ]
      )
    ]
  );

  const action = new Factor(factor, before);
  action.apply();

  return assertAA(before, expected, "Factor test 4 failed");
}

function SFTest1() {

  const before = new Tag(Orientation.NS, [new Tag(Orientation.EW, [v1, l1])], [v2]);

  const e1 = new Tag(Orientation.NS, [new Variable(1)], [new Variable(2)]);
  const e2 = new Tag(Orientation.NS, [new Literal(1)], [new Variable(2)]);
  const expected = new Tag(Orientation.EW, [e1, e2]);

  const action = new SplitFrac(before);
  action.apply();

  return assertAA(before, expected, "SplitFrac test 1 failed");
}

function SFTest2() {

  let t1 = new Tag(Orientation.NS, [v1, v2]);
  const before = new Tag(Orientation.NS, [new Tag(Orientation.EW, [t1], [v3])], [l1]);

  const e1 = new Tag(Orientation.NS,
    [
      new Tag(Orientation.NS, [new Variable(1), new Variable(2)])
    ],
    [new Literal(1)]
  );
  const e2 = new Tag(Orientation.NS, [v3], [l1]);
  const expected = new Tag(Orientation.EW, [e1], [e2]);

  const action = new SplitFrac(before);
  action.apply();

  return assertAA(before, expected, "SplitFrac test 2 failed");
}

function SFTest3() {

  const t1 = new Tag(Orientation.NS, [v1, v2]);
  const before = new Tag(Orientation.NS,
    [new Tag(Orientation.EW, [t1,l1,l2], [v3,l3])],
    [v4, v5]
  );

  const e1 = new Tag(Orientation.NS,
    [new Tag(Orientation.NS, [new Variable(1), new Variable(2)])],
    [new Variable(4), new Variable(5)]
  );
  const e2 = new Tag(Orientation.NS, [new Literal(1)], [new Variable(4), new Variable(5)]);
  const e3 = new Tag(Orientation.NS, [new Literal(2)], [new Variable(4), new Variable(5)]);
  const e4 = new Tag(Orientation.NS, [new Variable(3)], [new Variable(4), new Variable(5)]);
  const e5 = new Tag(Orientation.NS, [new Literal(3)], [new Variable(4), new Variable(5)]);
  const expected = new Tag(Orientation.EW, [e1, e2, e3], [e4, e5]);

  const action = new SplitFrac(before);
  action.apply();

  return assertAA(before, expected, "SplitFrac test 3 failed");
}

function CFTest1() {

  const t1 = new Tag(Orientation.NS, [new Literal(1)], [new Variable(1), new Variable(2)]);
  const t2 = new Tag(Orientation.NS, [new Variable(3)], [new Variable(1), new Variable(2)]);
  const t3 = new Tag(Orientation.NS, [new Literal(2)], [new Variable(1), new Variable(2)]);
  const before = new Tag(Orientation.EW, [t1, t2, t3]);

  const dividend = new Tag(Orientation.EW, [new Literal(1), new Variable(3), new Literal(2)]);
  const expected = new Tag(Orientation.NS, [dividend], [new Variable(1), new Variable(2)]);

  const action = new CombineFrac(before);
  action.apply();

  return assertAA(before, expected, "CombineFrac test 1 failed");
}

function CFTest2() {

  const t1 = new Tag(Orientation.NS, [l1], [new Variable(1), new Variable(2)]);
  const t2 = new Tag(Orientation.NS, [v3], [new Variable(1), new Variable(2)]);
  const t3 = new Tag(Orientation.NS, [l2], [new Variable(1), new Variable(2)]);
  const before = new Tag(Orientation.EW, [], [t1, t2, t3]);

  const dividend = new Tag(Orientation.EW, [],[new Literal(1), new Variable(3), new Literal(2)]);
  const expected = new Tag(Orientation.NS, [dividend], [new Variable(1), new Variable(2)]);

  const action = new CombineFrac(before);
  action.apply();

  return assertAA(before, expected, "CombineFrac test 2 failed");
}

function CFTest3() {

  const ti = new Tag(Orientation.EW, [v4, v5]);

  const t1 = new Tag(Orientation.NS,
    [v1],
    [new Tag(Orientation.EW, [new Literal(1), new Variable(2)])]
  );
  const t2 = new Tag(Orientation.NS,
    [ti],
    [new Tag(Orientation.EW, [new Literal(1), new Variable(2)])]
  );
  const t3 = new Tag(Orientation.NS,
    [l2],
    [new Tag(Orientation.EW, [new Literal(1), new Variable(2)])]
  );
  const t4 = new Tag(Orientation.NS,
    [v3],
    [new Tag(Orientation.EW, [new Literal(1), new Variable(2)])]
  );
  const before = new Tag(Orientation.EW, [t1, t2], [t3, t4]);

  const dividend = new Tag(Orientation.EW,
    [new Variable(1), new Tag(Orientation.EW, [v4, v5])],
    [new Literal(2), new Variable(3)]
  );
  const expected = new Tag(Orientation.NS,
    [dividend],
    [new Tag(Orientation.EW, [new Literal(1), new Variable(2)])]
  );

  const action = new CombineFrac(before);
  action.apply();

  return assertAA(before, expected, "CombineFrac test 3 failed");
}

function QFTest1() {

  const inner = new Tag(Orientation.NS, [v1, v2], [v3]);
  const before = new Tag(Orientation.NS, [inner]);

  const expected = new Tag(Orientation.NS,
    [],
    [new Tag(Orientation.NS, [new Variable(3)], [new Variable(1), new Variable(2)])]
  );

  const action = new QuadrantFlip(inner, Quadrant.NW);
  action.apply();

  return assertAA(before, expected, "QuadrantFlip test 1 failed");
}

function QFTest2() {

  const inner = new Tag(Orientation.EW, [v1, v2, l1], [l2, v3]);
  const before = new Tag(Orientation.EW, [inner]);

  const expected = new Tag(Orientation.EW,
    [],
    [
      new Tag(Orientation.EW,
        [new Literal(2), new Variable(3)],
        [new Variable(1), new Variable(2), new Literal(1)])
    ]
  );

  const action = new QuadrantFlip(inner, Quadrant.NW);
  action.apply();

  return assertAA(before, expected, "QuadrantFlip test 2 failed");
}

function QFTest3() {

  const inner = new Tag(Orientation.EW, [l2, v3], [v1, v2, l1]);
  const before = new Tag(Orientation.EW,
    [],
    [inner]
  );

  const expected = new Tag(Orientation.EW,
    [
      new Tag(Orientation.EW,
        [new Variable(1), new Variable(2), new Literal(1)],
        [new Literal(2), new Variable(3)])
    ]
  );

  const action = new QuadrantFlip(inner, Quadrant.SE);
  action.apply();

  return assertAA(before, expected, "QuadrantFlip test 3 failed");
}

function CTest1() {

  const v2a = new Variable(2);
  const v2b = new Variable(2);
  const before = new Tag(Orientation.NS,
    [v1, v2a, v3],
    [v2b]
  );

  const expected = new Tag(Orientation.NS,
    [new Variable(1), new Variable(3)],
    []
  );

  const action = new Cancel(v2a, v2b);
  action.apply();

  return assertAA(before, expected, "Cancel test 1 failed");
}

function CTest2() {

  const t1 = new Tag(Orientation.NS, [v1, v2], [l1]);
  const t2 = new Tag(Orientation.NS, [new Variable(1), new Variable(2)], [new Literal(1)]);
  const before = new Tag(Orientation.EW,
    [v4, t1, l2, l3],
    [t2]
  );

  const expected = new Tag(Orientation.EW,
    [new Variable(4), new Literal(2), new Literal(3)],
    []
  );

  const action = new Cancel(t1, t2);
  action.apply();

  return assertAA(before, expected, "Cancel test 2 failed");
}

function IBTest1() {

  const before = new Tag(Orientation.NS, [v1, v2, l1]);

  const expected = new Tag(Orientation.NS,
    [new Variable(1), new Variable(2), new Literal(1), new Literal(2)],
    [new Literal(2)]
  );

  const action = new IdentityBalance(new Literal(2), before);
  action.apply();

  return assertAA(before, expected, "IdentityBalance test 1 failed");
}

function IBTest2() {

  const before = new Tag(Orientation.EW, [v1, l1, l2], [v2, v3]);

  const expected = new Tag(Orientation.EW,
    [new Variable(1), new Literal(1), new Literal(2), new Variable(4)],
    [new Variable(2), new Variable(3), new Variable(4)]
  );

  const action = new IdentityBalance(new Variable(4), before);
  action.apply();

  return assertAA(before, expected, "IdentityBalance test 2 failed");
}

function testAll() {

  try {
    if(CSTest1()&&CSTest2()&&CSTest3()){
      allPassed("CommutativeSwap");
    }
    if(AMTest1()&&AMTest2()&&AMTest3()) {
      allPassed("AssociativeMerge");
    }
    if(AITest1()&&AITest2()&&AITest3()) {
      allPassed("AssociativeIntro");
    }
    if(AInsTest1()&&AInsTest2()&&AInsTest3()) {
      allPassed("AssociativeInsert");
    }
    if(AETest1()&&AETest2()) {
      allPassed("AssociativeExtract");
    }
    if(DTest1()&&DTest2()&&DTest3()) {
      allPassed("Distribute");
    }
    if(FTest1()&&FTest2()&&FTest3()&&FTest4()) {
      allPassed("Factor");
    }
    if(SFTest1()&&SFTest2()&&SFTest3()) {
      allPassed("SplitFrac");
    }
    if(CFTest1()&&CFTest2()&&CFTest3()) {
      allPassed("CombineFrac");
    }
    if(QFTest1()&&QFTest2()&&QFTest3()) {
      allPassed("QuadrantFlip");
    }
    if(CTest1()&&CTest2()) {
      allPassed("Cancel");
    }
    if(IBTest1()&&IBTest2()) {
      allPassed("IdentityBalance");
    }
  } catch(error) {
    // console.log("Algebraic Action Reference errors has occurred");
    console.log(error);
  }
}

testAll();
