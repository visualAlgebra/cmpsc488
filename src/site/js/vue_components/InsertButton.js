import {ExpressionTree as JsExpressionTree} from "../expression_tree";
import {Mouse} from "../gui";
import ExpressionTree from "./ExpressionTree";

export default {
  name: "InsertButton",

  props: {
    tree: JsExpressionTree,
    mouse: Mouse,
    clickable: Boolean,
  },

  template: `
<div
  v-on="listeners"
  :class="classes"
>
  <ExpressionTree
    :tree="tree"
    :interactive="!clickable"
    :mouse="mouse"
    insertable
  ></ExpressionTree>
</div>
  `,

  computed: {
    listeners() {
      return (this.clickable) ? {
        click: () => this.$emit("click", this.tree)
      } : {};
    },

    classes() {
      return (this.clickable) ? {
        "col": true,
        "creator-insertion-btn": true,
        "pulse": true,
      } : {
        "col": true,
      };
    },
  },

  components: {
    ExpressionTree,
  },
}