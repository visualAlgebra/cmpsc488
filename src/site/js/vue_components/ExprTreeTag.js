import {Orientation, Quadrant, ExpressionTree as jsExpressionTree} from "../expression_tree";
import ExprTreeTagButton from "./ExprTreeTagButton";
import ExprTreeTagQuadrant from "./ExprTreeTagQuadrant";

export default {
  name: "ExprTreeTag",

  props: {
    tree: jsExpressionTree,
    interactive: Boolean,
  },

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    
    <ExprTreeTagQuadrant
      :tree="tree"
      :quadrant="Quadrant.NW"
      :values="tree.NW"
      :interactive="interactive"
    >
    </ExprTreeTagQuadrant>
    
    <ExprTreeTagButton
      :tree="tree"
      :interactive="interactive"
    ></ExprTreeTagButton>
    
    <ExprTreeTagQuadrant
      :tree="tree"
      :quadrant="Quadrant.SE"
      :values="tree.SE"
      :interactive="interactive"
    >
    </ExprTreeTagQuadrant>
    
  </div>
  `,

  components: {
    ExprTreeTagQuadrant,
    ExprTreeTagButton,
  },

  data() {
    return {
      Quadrant: Quadrant,
    };
  },

  computed: {
    classes() {
      return [
        this.tree.orientation === Orientation.NS ? "north-south" : "east-west",
        "tag",
      ];
    },
  },
};