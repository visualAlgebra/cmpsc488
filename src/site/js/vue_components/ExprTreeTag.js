import {Orientation, Quadrant} from "../expression_tree";
import ExprTreeTagButton from "./ExprTreeTagButton";
import ExprTreeTagQuadrant from "./ExprTreeTagQuadrant";

export default {
  name: "ExprTreeTag",

  props: ["tree", "hoverable"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    
    <ExprTreeTagQuadrant
      :quadrant="Quadrant.NW"
      :values="tree.NW"
      :hoverable="hoverable"
    >
    </ExprTreeTagQuadrant>
    
    <ExprTreeTagButton
      :hoverable="hoverable"
    ></ExprTreeTagButton>
    
    <ExprTreeTagQuadrant
      quadrant="Quadrant.SE"
      :values="tree.SE"
      :hoverable="hoverable"
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
        "tag",
      ];
    },
  },
};