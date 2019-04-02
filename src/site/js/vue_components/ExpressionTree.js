import ExprTreeTag from "./ExprTreeTag";
import ExprTreeVariable from "./ExprTreeVariable";
import ExprTreeLiteral from "./ExprTreeLiteral";
import {ExpressionTree} from "../expression_tree";
import {Mouse} from "../gui";

export default {
  name: "ExpressionTree",

  props: {
    tree: ExpressionTree,
    interactive: Boolean,
    mouse: Mouse,
  },

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ExprTreeTag
      v-if="tree.kind === 'tag'"
      :tree="tree"
      :interactive="interactive"
      :mouse="mouse"
    >
    </ExprTreeTag>
    <ExprTreeVariable
      v-else-if="tree.kind === 'variable'"
      :tree="tree"
      :interactive="interactive"
      :mouse="mouse"
    >
    </ExprTreeVariable>
    <ExprTreeLiteral
      v-else-if="tree.kind === 'literal'"
      :tree="tree"
      :interactive="interactive"
      :mouse="mouse"
    >
    </ExprTreeLiteral>
  </div>
  `,

  components: {
    ExprTreeTag,
    ExprTreeVariable,
    ExprTreeLiteral,
  }

};