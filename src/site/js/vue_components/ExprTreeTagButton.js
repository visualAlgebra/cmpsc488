import {ClickTargetKind} from "../gui";
import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";
import {ExpressionTree} from "../expression_tree";

export default {
  name: "ExprTreeTagButton",

  props: {
    tree: ExpressionTree,
    path: Array,
  },

  mixins: [ExprTreeListenerMixin],

  template: `
  <div
    xmlns="http://www.w3.org/1999/xhtml"
    v-on="listeners"
    class="tag-button-column"
   >
    <div xmlns="http://www.w3.org/1999/xhtml" :class="classes"></div>
  </div>
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
};