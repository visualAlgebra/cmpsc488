import {Orientation, Quadrant} from "../expression_tree";
import ExprTreeTagButton from "./ExprTreeTagButton";
import ExprTreeTagQuadrant from "./ExprTreeTagQuadrant";

export default {
  name: "ExprTreeTag",

  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    
    <ExprTreeTagQuadrant
      :quadrant="Quadrant.NW"
      :values="tree.NW"
    >
    </ExprTreeTagQuadrant>
    
    <ExprTreeTagButton></ExprTreeTagButton>
    
    <ExprTreeTagQuadrant
      quadrant="Quadrant.SE"
      :values="tree.SE"
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
      Quadrant: Quadrant
    };
  },

  computed: {
    classes() {
      return [
        this.tree.orientation === Orientation.NS ? "north-south" : "east-west",
        "tag"
      ];
    },
  },
};