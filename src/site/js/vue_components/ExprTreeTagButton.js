import {TreeComponentKind} from "../gui";
import ExprTreeListenerMixin from "./vue_mixins/ExprTreeListenerMixin";

export default {
  name: "ExprTreeTagButton",

  props: ["tree"],

  mixins: [ExprTreeListenerMixin],

  template: `
  <div
    xmlns="http://www.w3.org/1999/xhtml"
    class="tag-button-column"
   >
    <div xmlns="http://www.w3.org/1999/xhtml" :class="classes"></div>
  </div>
  `,

  data() {
    return {
      guiObj: {
        kind: TreeComponentKind.TagButton,
        tree: this.tree,
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