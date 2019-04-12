import ExprTreeTag from "./ExprTreeTag";
import ExprTreeVariable from "./ExprTreeVariable";
import ExprTreeLiteral from "./ExprTreeLiteral";
import {ExpressionTree, ExprTreeKind} from "../expression_tree";
import {Mouse} from "../gui";

export default {
  name: "ExpressionTree",

  props: {
    tree: ExpressionTree,
    path: {
      type: Array,
      default: () => [],
    },
    interactive: Boolean,
    mouse: Mouse,
  },

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ExprTreeTag
      v-if="tree.kind === ExprTreeKind.Tag"
      :tree="tree.clone()"
      :path="path"
      :interactive="interactive"
      :mouse="mouse"
    ></ExprTreeTag>
    <ExprTreeVariable
      v-else-if="tree.kind === ExprTreeKind.Var"
      :tree="tree.clone()"
      :path="path"
      :interactive="interactive"
      :mouse="mouse"
    ></ExprTreeVariable>
    <ExprTreeLiteral
      v-else-if="tree.kind === ExprTreeKind.Lit"
      :tree="tree.clone()"
      :path="path"
      :interactive="interactive"
      :mouse="mouse"
    ></ExprTreeLiteral>
  </div>
  `,

  data: () => ({
    ExprTreeKind,
  }),

  components: {
    ExprTreeTag,
    ExprTreeVariable,
    ExprTreeLiteral,
  }

};