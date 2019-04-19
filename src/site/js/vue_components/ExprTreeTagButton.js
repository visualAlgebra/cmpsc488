import {ClickTargetKind} from "../gui";
import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {ExpressionTree} from "../expression_tree";
import {Drag, Drop} from "vue-drag-drop";

export default {
  name: "ExprTreeTagButton",

  props: {
    tree: ExpressionTree,
    path: Array,
  },

  mixins: [ExprTreeListenerMixin],

  template: `
<drop @drop="handleDrop">
  <drag @dragstart="handleDragStart" :hide-image-html="true" :image="null" :transferData="guiObj">
    <div
      v-on="listeners"
      xmlns="http://www.w3.org/1999/xhtml"
      class="tag-button-column"
     >
      <div xmlns="http://www.w3.org/1999/xhtml" :class="classes"></div>
    </div>
  </drag>
</drop>
  `,

  data() {
    return {
      guiObj: {
        kind: ClickTargetKind.TagButton,
        tree: this.tree,
        path: this.path,
      },
    };
  },

  computed: {
    classes() {
      return [
          "tag-button",
          this.interactive ? "hoverable" : "",
      ]
    },
  },

  components: {
    Drag,
    Drop,
  },
};