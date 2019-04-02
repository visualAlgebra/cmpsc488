// import {
//   AssociativeExtract,
//   AssociativeInsert, AssociativeIntro,
//   AssociativeMerge, Cancel, CombineFrac,
//   CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
//   QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
// } from "./algebraic_actions";
import { compress_string_js, ExpressionTree, Literal, Variable, Tag, Quadrant, Orientation, ProblemInfo } from "./expression_tree";
import { networkInterfaces } from "os";

let i = 1;

function NSTag(NW, SE) {
  return new Tag(Orientation.NS, NW, SE);
}

function EWTag(NW, SE) {
  return new Tag(Orientation.EW, NW, SE);
}

function lit(val) {
  return new Literal(val);
}

function vari(val) {
  return new Variable(val);
}

function start2() {
  return NSTag(
    [
      NSTag(      
        [
          vari(1), vari(2)
        ],
        [
          lit(1)
        ]
      )
    ]
  )
}

function goal2() {
  return NSTag(
    [
      NSTag(
        [
          vari(1), 
          NSTag(      
            [
              vari(2)
            ],
            [
              lit(1)
            ]
          )
        ]
      )
    ]
  )
}

function start3() {
  return EWTag(
    [
      NSTag(
        [
          vari(1), lit(2)
        ]
      ),
      NSTag(
        [
          vari(1), lit(2), vari(3)
        ]
      )
    ],
    [
      vari(1)
    ]
  )
}

function goal3() {
  return EWTag(
    [
      NSTag(
        [
          vari(1),
          EWTag(
            [
              lit(2), 
              NSTag(
                [
                  lit(2), vari(3)
                ]
              )
            ]
          )
        ]
      )
    ],
    [
      vari(1)
    ]
  )
}

function start4() {
  return NSTag(
    [
      EWTag(
        [
          vari(1), vari(2), lit(2)
        ],
        [
          vari(3)
        ]  
      )
    ],
    [
      lit(1), vari(4)
    ]
  )
}

function goal4() {
  return EWTag(
    [
      NSTag(
        [
          EWTag(
            [
              vari(1), vari(2)
            ]
          )
        ],
        [
          lit(1), vari(4)
        ]
      ),
      NSTag(
        [
          lit(2)
        ],
        [
          lit(1), vari(4)
        ]
      )
    ],
    [
      NSTag(
        [
          vari(3)
        ],
        [
          lit(1), vari(4)
        ]
      )
    ]
  )
}

function start5() {
  return NSTag(
    [
      vari(1)
    ],
    [
      NSTag(
        [
          vari(1), vari(3)
        ],
        [
          vari(2)
        ]
      ),
      NSTag(
        [
          vari(2)
        ],
        [
          vari(1)
        ]
      )
    ]
  )
}

function goal5() {
  return NSTag(
    [
      vari(1)
    ],
    [
      vari(3)
    ]
  )
}

function start6() {

}

let startArr = [];
let goalArr = [];

//Commutative 
startArr.push(new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2), new Literal(2)]));
goalArr.push(new Tag(Orientation.EW, [new Variable(1), new Literal(1)], [new Literal(2), new Variable(2)]));

//Associative
startArr.push(start2());
goalArr.push(goal2());

//Distributive
startArr.push(start3());
goalArr.push(goal3());

//Fractions
startArr.push(start4());
goalArr.push(goal4());

//Cancel
startArr.push(start5());
goalArr.push(goal5());

//Literals

function createProblem(s, g, des) {
  let retval=new ProblemInfo('tut_'+i);
  compress_string_js(s.toString(), res=>{
    retval.expression_start=res;
  });
  compress_string_js(g.toString(), res=>{
    retval.expression_goal=res;
  });
  retval.description=des;
  retval.tutorial = null;
  return retval;
}

export function createAll() {
  for( ; i<startArr.length; i++) {
    console.log(createProblem(startArr[i], goalArr[i], "Tutorial Problem " + i));
  }
}