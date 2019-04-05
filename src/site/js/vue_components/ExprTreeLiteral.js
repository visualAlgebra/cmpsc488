import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {ClickTargetKind} from "../gui";
import {ExpressionTree} from "../expression_tree";

export default {
  name: "ExprTreeLiteral",

  props: {
    tree: ExpressionTree,
    path: Array,
  },

  mixins: [ExprTreeListenerMixin],

  template: `
  <div
    v-on="listeners"
    :class="classes"
    xmlns="http://www.w3.org/1999/xhtml"
  >
    {{ tree.value }}
  </div>
  `,

  data() {
    return {
      guiObj: {
        kind: ClickTargetKind.Literal,
        tree: this.tree,
        path: this.path,
      }
    };
  },

  computed: {
    classes() {
      return [
          "literal",
          this.interactive ? "hoverable" : "",
      ]
    },
  },
};