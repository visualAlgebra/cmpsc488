import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {TreeComponentKind} from "../gui";
import {ExpressionTree as jsExpressionTree, Quadrant} from "../expression_tree";

export default {
  name: "ExprTreeTagQuadrant",

  props: {
    tree: jsExpressionTree,
    path: Array,
    pathOffset: Number,
    quadrant: String,
    values: Array,
    interactive: Boolean,
  },

  mixins: [ExprTreeListenerMixin],

  template: `
  <div
    v-on="listeners"
    :class="classes"
    xmlns="http://www.w3.org/1999/xhtml"
  >
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      v-for="(subtree, index) in values"
      class="tag-element-container"
    >
      <ExpressionTree
        :key="subtree.id"
        :tree="subtree.clone()"
        :path="extendPath(index)"
        :interactive="interactive"
        :mouse="mouse"
      ></ExpressionTree>
    </div>
  </div>
  `,

  data() {
    return {
      guiObj: {
        kind: TreeComponentKind.TagQuadrant,
        tree: this.tree,
        path: this.path,
      },
    };
  },

  computed: {
    classes() {
      return [
        this.quadrant === Quadrant.NW ? "north-west" : "south-east",
        this.interactive ? "hoverable" : "",
      ];
    },
  },

  methods: {
    extendPath(index) {
      return [...this.path, this.pathOffset + index];
    },
  },

  components: {
    // This solves circular reference problem.
    // See https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    ExpressionTree: () => import("./ExpressionTree.js"),
  },
};

