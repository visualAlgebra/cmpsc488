import ExprTreeTag from "./ExprTreeTag";
import ExprTreeVariable from "./ExprTreeVariable";
import ExprTreeLiteral from "./ExprTreeLiteral";

export default {
  name: "ExpressionTree",

  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ExprTreeTag
      v-if="tree.kind === 'tag'"
      :tree="tree"
    >
    </ExprTreeTag>
    <ExprTreeVariable
      v-else-if="tree.kind === 'variable'"
      :tree="tree"
    >
    </ExprTreeVariable>
    <ExprTreeLiteral
      v-else-if="tree.kind === 'literal'"
      :tree="tree"
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