import {Literal, Orientation, Tag, Variable} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";

export default {

  name: "InsertionButtons",

  template: `
<div class="row insertion-btn-row">
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeEWTag()"
    ></ExpressionTree>
  </div>
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeNSTag()"
    ></ExpressionTree>
  </div>
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeLit(0)"
    ></ExpressionTree>
  </div>
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeLit(1)"
    ></ExpressionTree>
  </div>
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeLit(2)"
    ></ExpressionTree>
  </div>
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeVar(1)"
    ></ExpressionTree>
  </div>
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeVar(2)"
    ></ExpressionTree>
  </div>
  <div class="col insertion-btn">
    <ExpressionTree
      :tree="makeVar(3)"
    ></ExpressionTree>
  </div>
</div>
  `,

  methods: {
    makeEWTag: () => new Tag(Orientation.EW, [], []),
    makeNSTag: () => new Tag(Orientation.NS, [], []),
    makeVar: x => new Variable(x),
    makeLit: x => new Literal(x),
  },

  components: {
    ExpressionTree,
  },
}