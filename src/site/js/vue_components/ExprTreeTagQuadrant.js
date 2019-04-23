import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {ClickTargetKind, MouseMode} from "../gui";
import {ExpressionTree as jsExpressionTree, Quadrant} from "../expression_tree";
import {Drag, Drop} from "vue-drag-drop";

export default {
  name: "ExprTreeTagQuadrant",

  props: {
    tree: jsExpressionTree,
    path: Array,
    pathOffset: Number,
    quadrant: String,
    values: Array,
    interactive: Boolean,
    pulse: {
      default: false,
      type: Boolean,
    },
  },

  mixins: [ExprTreeListenerMixin],

  template: `
<drop @drop="handleDrop">
  <div
    :class="classes"
    xmlns="http://www.w3.org/1999/xhtml"
    v-on="listener"
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
        :insertable="insertable"
        :pulse="pulse"
      ></ExpressionTree>
    </div>
  </div>
</drop>
  `,

  data() {
    return {
      guiObj: {
        kind: ClickTargetKind.TagQuadrant,
        tree: this.tree,
        path: this.path,
        quadrant: this.quadrant,
      },
    };
  },

  computed: {
    classes() {
      const isNW = this.quadrant === Quadrant.NW;
      const isSE = this.quadrant === Quadrant.SE;
      const isInteractive = this.interactive;
      const spaceItOut = this.values.length === 0;
      const pulse = this.pulse;
      return {
        "north-west": isNW,
        "south-east": isSE,
        "hoverable": isInteractive,
        "tag-spacer": spaceItOut,
        "pulse": pulse,
      };
    },

    listener() {
      return (this.pulse) ? {
        click: e => {
          e.stopPropagation();
          this.mouse.mode = MouseMode.SelectingInsertionQuadrant;
          this.mouse.eventSource = this.guiObj;
          this.mouse.clickDetected();
        },
      } : {};
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
    Drag,
    Drop,
  },
};

