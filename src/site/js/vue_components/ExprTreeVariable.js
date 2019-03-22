import {TreeComponentKind} from "../gui";
import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";

export default {
  name: "ExprTreeVariable",

  props: ["tree"],

  mixins: [ExprTreeListenerMixin],

  template: `
  <div
    v-on="listeners"
    :class="classes"
    xmlns="http://www.w3.org/1999/xhtml"
  >
    {{ "x" + tree.value }}
  </div>
  `,

  data() {
    return {
      guiObj: {
        kind: TreeComponentKind.Variable,
        tree: this.tree,
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
};