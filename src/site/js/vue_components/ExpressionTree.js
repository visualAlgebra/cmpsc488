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
    mouse: Mouse,
    interactive: Boolean,
    insertable: Boolean,
    pulse: {
      default: false,
      type: Boolean,
    },
  },

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ExprTreeTag
      v-if="tree.kind === ExprTreeKind.Tag"
      :tree="tree.clone()"
      :path="path"
      :mouse="mouse"
      :interactive="interactive"
      :insertable="insertable"
      :pulse="pulse"
    ></ExprTreeTag>
    <ExprTreeVariable
      v-else-if="tree.kind === ExprTreeKind.Var"
      :tree="tree.clone()"
      :path="path"
      :mouse="mouse"
      :interactive="interactive"
      :insertable="insertable"
    ></ExprTreeVariable>
    <ExprTreeLiteral
      v-else-if="tree.kind === ExprTreeKind.Lit"
      :tree="tree.clone()"
      :path="path"
      :mouse="mouse"
      :interactive="interactive"
      :insertable="insertable"
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