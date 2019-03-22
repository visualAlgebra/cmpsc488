import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {TreeComponentKind} from "../gui";

export default {
  name: "ExprTreeLiteral",

  props: ["tree"],

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
        kind: TreeComponentKind.Literal,
        tree: this.tree,
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