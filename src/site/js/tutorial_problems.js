// import {
//   AssociativeExtract,
//   AssociativeInsert, AssociativeIntro,
//   AssociativeMerge, Cancel, CombineFrac,
//   CommutativeSwap, Distribute, Factor, IdentityMerge, LiteralMerge,
//   QuadrantFlip, SplitFrac, ZeroMerge, LiteralConversion
// } from "./algebraic_actions";
import { compress_string_js, ExpressionTree, Literal, Variable, Tag, Quadrant, Orientation, ProblemInfo } from "./expression_tree";

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

function prob2Start() {
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

function prob2Goal() {
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

function prob3Start() {
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
      NSTag(
        [
          vari(1)
        ]
      )
    ]
  )
}

function prob3Goal() {
  return NSTag(
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
        ],
        [
          lit(1)
        ]
      )
    ]
  )
}

let startArr = [];
let goalArr = [];

startArr.push(new Tag(Orientation.EW, [new Literal(1), new Variable(1)], [new Variable(2), new Literal(2)]));
goalArr.push(new Tag(Orientation.EW, [new Variable(1), new Literal(1)], [new Literal(2), new Variable(2)]));

startArr.push(prob2Start());
goalArr.push(prob3Goal());

startArr.push(prob3Start());
goalArr.push(prob3Goal());

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