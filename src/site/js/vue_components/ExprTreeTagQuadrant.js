import {Quadrant} from "../expression_tree";

export default {
  name: "ExprTreeTagQuadrant",

  props: ["quadrant", "values", "hoverable"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml" :class="classes">
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      v-for="subtree in values"
      class="tag-element-container"
    >
      <ExpressionTree
        :tree="subtree"
        :hoverable="hoverable"
      ></ExpressionTree>
    </div>
  </div>
  `,

  components: {
    // See https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    // This solves circular reference problem.
    ExpressionTree: () => import("./ExpressionTree.js"),
  },

  computed: {
    classes() {
      return [
        this.quadrant === Quadrant.NW ? "north-west" : "south-east",
        this.hoverable ? "hoverable" : "",
      ];
    },
  },
};

