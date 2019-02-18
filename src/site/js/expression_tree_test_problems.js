
function problem_e1(){
  // x4 + 0 - 2 - x1
  return new Tag(
    Orientation.EW,
    [new Variable(4), new Literal(0)],
    [new Literal(2), new Variable(1)]
  )
}

function problem_e2(){
  // (2 * x1) + x2
  return new Tag(
    Orientation.EW,
    [
      new Tag(
        Orientation.NS,
        [new Literal(2), new Literal(8), new Variable(1), new Variable(3)],
        [new Literal(4)]
      ),
      new Variable(2)
    ],
    []
  )
}

function problem_e3(){
  return new Tag(Orientation.EW, [new Literal(2), new Variable(3)]);
}

function problem_e4(){
  return new Tag(
    Orientation.EW,
    [
      new Tag(
        Orientation.EW,
        [
          new Tag(
            Orientation.EW,
            [
              new Tag(
                Orientation.EW,
                [
                  new Tag(
                    Orientation.EW,
                    [
                      new Tag(
                        Orientation.EW,
                        [new Variable(7)],
                        [new Variable(6)]
                      )
                    ],
                    [new Variable(5)]
                  )
                ],
                [new Variable(4)]
              )
            ],
            [new Variable(3)]
          )
        ],
        [new Variable(2)]
      )
    ],
    [new Variable(1)]
  )
}
function problem_e5(){
  return new Tag(Orientation.NS,[new Variable(5)],[]);
}

function problem_e6(){
  return new Tag(Orientation.NS,[],[new Variable(24)]);
}

function problem_e7(){
  return new Tag(Orientation.NS,[new Tag(Orientation.NS,[],[new Variable(22)])],[new Tag(Orientation.NS,[new Variable(22)],[])]);
}
  
function problem_e8(){
  return new Tag(
  Orientation.EW,
  [
    new Literal(2),
    new Tag(
      Orientation.NS,
      [new Literal(1), new Variable(1)],
      [new Literal(0)]
    ),
    new Variable(2),
    new Tag(
      Orientation.EW,
      [new Literal(2)],
      []
    )
  ],
  [new Variable(3), new Literal(0)]
);
}

function problem_e9(){
  return new Tag(
    Orientation.EW,
    [
      new Tag(
        Orientation.EW,
        [
          new Tag(
            Orientation.EW,
            [
              new Tag(
                Orientation.EW,
                [
                  new Tag(
                    Orientation.EW,
                    [
                      new Tag(
                        Orientation.EW,
                        [],
                        [new Variable(6)]
                      )
                    ],
                    []
                  )
                ],
                []
              )
            ],
            []
          )
        ],
        [new Variable(2439)]
      )
    ],
    []
  )
}

function problem_e10(){
  return new Tag(
    Orientation.EW,
    [],
    [
      new Tag(
        Orientation.EW,
        [],
        [new Variable(2439),
          new Tag(
            Orientation.EW,
            [
              new Tag(
                Orientation.EW,
                [],
                [
                  new Tag(
                    Orientation.EW,
                    [
                      new Tag(
                        Orientation.EW,
                        [],
                        [new Variable(6)]
                      )
                    ],
                    []
                  )]
              )
            ],
            []
          )]
      )]
  )
}
  
function problem_h1(){
  let h1 = new Tag(Orientation.EW)
  h1.addNorthWest(new Variable(4))
  h1.addNorthWest(new Literal(0))
  h1.addSouthEast(new Literal(2))
  h1.addSouthEast(new Variable(1))
  return h1;
}

function problem_h2(){
  let h2 = new Tag(Orientation.EW)
  let v = new Tag(Orientation.NS)
  h2.addNorthWest(v)
  v.addNorthWest(new Literal(2))
  v.addNorthWest(new Literal(8))
  v.addNorthWest(new Variable(1))
  v.addNorthWest(new Variable(3))
  v.addSouthEast(new Literal(4))
  h2.addNorthWest(new Variable(2))
  return h2;
}

function problem_h3(){
  let h3 = new Tag(Orientation.EW)
  h3.addNorthWest(new Literal(2))
  h3.addNorthWest(new Variable(3))
  return h3;
}

function problem_h4(){
  let h4 = new Tag(Orientation.EW)
  let h41 = new Tag(Orientation.EW)
  h4.addNorthWest(h41)
  let h411 = new Tag(Orientation.EW)
  h41.addNorthWest(h411)
  let h4111 = new Tag(Orientation.EW)
  h411.addNorthWest(h4111)
  let h41111 = new Tag(Orientation.EW)
  h4111.addNorthWest(h41111)
  let h411111 = new Tag(Orientation.EW)
  h41111.addNorthWest(h411111)
  h411111.addNorthWest(new Variable(7))
  h411111.addSouthEast(new Variable(6))
  h41111.addSouthEast(new Variable(5))
  h4111.addSouthEast(new Variable(4))
  h411.addSouthEast(new Variable(3))
  h41.addSouthEast(new Variable(2))
  h4.addSouthEast(new Variable(1))
  return h4;
}

function problem_ans1(){
  return ans1 = [
    93,
    0,
    0,
    0,
    2,
    27,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    90,
    17,
    100,
    103,
    78,
    -124,
    111,
    -53,
    100,
    -108,
    69,
    -59,
    33,
    20,
    -58,
    87,
    -74,
    74,
    -11,
    114,
    -10,
    50,
    -1,
    -8,
    -76,
    84,
    0
  ]
}
function problem_ans2(){
  return ans2 = [
    93,
    0,
    0,
    0,
    2,
    46,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    90,
    8,
    -85,
    11,
    -84,
    -112,
    -35,
    -58,
    5,
    -74,
    23,
    10,
    13,
    90,
    62,
    -106,
    17,
    -93,
    -35,
    -41,
    -67,
    117,
    -22,
    -93,
    22,
    -79,
    -103,
    52,
    71,
    120,
    -52,
    68,
    127,
    -3,
    -91,
    16,
    0
  ]
}
function problem_ans3(){
  return ans3 = [
    93,
    0,
    0,
    0,
    2,
    19,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    89,
    -26,
    -14,
    42,
    9,
    -39,
    -93,
    23,
    9,
    -14,
    -54,
    -19,
    -91,
    82,
    -125,
    -1,
    -1,
    -70,
    -104,
    0,
    0];
}

function problem_ans4(){
  return ans4 = [
    93,
    0,
    0,
    0,
    2,
    94,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    61,
    -99,
    4,
    -88,
    114,
    97,
    46,
    31,
    72,
    -94,
    17,
    120,
    107,
    6,
    -127,
    -100,
    -75,
    55,
    75,
    55,
    -104,
    121,
    -17,
    38,
    -110,
    -66,
    89,
    -31,
    -71,
    -33,
    88,
    95,
    -1,
    -10,
    120,
    -128,
    0
  ]
}
function problem_db1(){
    return "{tEW{{{tNS{{{l2}{l8}{v1}{v3}}{{l4}}}}{v2}}{}}}";
}
function problem_db2(){
    return "{tEW{{{l2}{tNS{{{l1}{v1}}{{l0}}}}{v2}{tEW{{{l2}}{}}}}{{v3}{l0}}}}";
}