import {ClickTargetKind} from "../gui";
import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {ExpressionTree} from "../expression_tree";
import {Drag, Drop} from "vue-drag-drop";

export default {
  name: "ExprTreeVariable",

  props: {
    tree: ExpressionTree,
    path: Array,
  },

  mixins: [ExprTreeListenerMixin],

  template: `
<drop @drop="handleDrop">
  <drag @dragstart="handleDragStart" :transferData="guiObj">
    <svg
      v-on="listeners"
      :class="classes"
      width="70"
      height="70"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >

     <g>
      <title>Layer 1</title>
      <polygon
        id="svg_1"
        :fill="fill"
        points="64.93092346191406,35.07620620727539 49.747314453125,61.37498474121094 19.380094528198242,61.37498474121094 4.19648551940918,35.07620620727539 19.380094528198242,8.777419090270996 49.747314453125,8.777419090270996 64.93092346191406,35.07620620727539 "
        :stroke="stroke"
        stroke-width="8"
        transform="rotate(30, 34.5637, 35.0762)"
        stroke-linejoin="round"
      />
     </g>
    </svg>
  </drag>
</drop>
  `,

  data() {
    return {
      guiObj: {
        kind: ClickTargetKind.Variable,
        tree: this.tree,
        path: this.path,
      }
    };
  },

  computed: {
    classes() {
      return [
        // "variable",
        this.interactive ? "hoverable" : "",
      ]
    },

    stroke() {
      if (this.tree.value % 3 === 0) return "#ff7f99";
      if (this.tree.value % 3 === 1) return "#f0b5ff";
      if (this.tree.value % 3 === 2) return "#ffc68e";
    },

    fill() {
      if (this.tree.value % 3 === 0) return "#e54477";
      if (this.tree.value % 3 === 1) return "#be6fbf";
      if (this.tree.value % 3 === 2) return "#f5aa3f";
    },
  },

  components: {
    Drag,
    Drop,
  },
};