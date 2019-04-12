import {Literal, Orientation, Tag, Variable} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";

export default {

  name: "InsertionButtons",

  template: `
<div class="row center-align">
  <div class="col s4">
    <ExpressionTree
      :tree="makeEWTag()"
    ></ExpressionTree>
  </div>
  <div class="col">
    <ExpressionTree
      :tree="makeNSTag()"
    ></ExpressionTree>
  </div>
  <div class="col">
    <ExpressionTree
      :tree="makeLit(0)"
    ></ExpressionTree>
  </div>
  <div class="col">
    <ExpressionTree
      :tree="makeLit(1)"
    ></ExpressionTree>
  </div>
  <div class="col">
    <ExpressionTree
      :tree="makeLit(2)"
    ></ExpressionTree>
  </div>
  <div class="col">
    <ExpressionTree
      :tree="makeVar(1)"
    ></ExpressionTree>
  </div>
  <div class="col">
    <ExpressionTree
      :tree="makeVar(2)"
    ></ExpressionTree>
  </div>
  <div class="col">
    <ExpressionTree
      :tree="makeVar(3)"
    ></ExpressionTree>
  </div>
</div>
  `,

  mounted() {
    document.addEventListener("mousemove", this.updateGhost);
  },

  data: () => ({
    ghostIsShown: false,
    ghostStyle: {
      position: "absolute",
      zIndex: 1000,
    },
  }),

  methods: {
    updateGhost(e) {
      if (this.ghostIsShown) {
        const ghost = document.getElementById("drag-ghost");
        ghost.style.left = e.pageX - (ghost.width.baseVal.value / 2) + "px";
        ghost.style.top = e.pageY - (ghost.height.baseVal.value / 2) + "px";
      }
    },
    makeEWTag: () => new Tag(Orientation.EW, [], []),
    makeNSTag: () => new Tag(Orientation.NS, [], []),
    makeVar: x => new Variable(x),
    makeLit: x => new Literal(x),
  },

  components: {
    ExpressionTree,
  },
}