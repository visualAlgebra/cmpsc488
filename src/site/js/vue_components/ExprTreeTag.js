import {Orientation, Quadrant, ExpressionTree as jsExpressionTree} from "../expression_tree";
import ExprTreeTagButton from "./ExprTreeTagButton";
import ExprTreeTagQuadrant from "./ExprTreeTagQuadrant";
import {Mouse} from "../gui";

export default {
  name: "ExprTreeTag",

  props: {
    tree: jsExpressionTree,
    path: Array,
    mouse: Mouse,
    interactive: Boolean,
    insertable: Boolean,
  },

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    
    <ExprTreeTagQuadrant
      :tree="tree.clone()"
      :path="path"
      :pathOffset="0"
      :quadrant="Quadrant.NW"
      :values="tree.NW"
      :interactive="interactive"
      :mouse="mouse"
      :insertable="insertable"
    >
    </ExprTreeTagQuadrant>
    
    <ExprTreeTagButton
      :tree="tree.clone()"
      :path="path"
      :interactive="interactive"
      :mouse="mouse"
      :insertable="insertable"
    ></ExprTreeTagButton>
    
    <ExprTreeTagQuadrant
      :tree="tree.clone()"
      :path="path"
      :pathOffset="tree.NW.length"
      :quadrant="Quadrant.SE"
      :values="tree.SE"
      :interactive="interactive"
      :mouse="mouse"
      :insertable="insertable"
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