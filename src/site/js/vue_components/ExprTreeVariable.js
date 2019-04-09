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
    <div
      v-on="listeners"
      :class="classes"
      xmlns="http://www.w3.org/1999/xhtml"
    >
      {{ "x" + tree.value }}
    </div>
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
        "variable",
        this.interactive ? "hoverable" : "",
      ]
    },
  },

  components: {
    Drag,
    Drop,
  },
};