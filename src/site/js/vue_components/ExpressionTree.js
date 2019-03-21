import ExprTreeTag from "./ExprTreeTag";
import ExprTreeVariable from "./ExprTreeVariable";
import ExprTreeLiteral from "./ExprTreeLiteral";

export default {
  name: "ExpressionTree",

  props: ["tree", "hoverable"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ExprTreeTag
      v-if="tree.kind === 'tag'"
      :tree="tree"
      :hoverable="hoverable"
    >
    </ExprTreeTag>
    <ExprTreeVariable
      v-else-if="tree.kind === 'variable'"
      :tree="tree"
      :hoverable="hoverable"
    >
    </ExprTreeVariable>
    <ExprTreeLiteral
      v-else-if="tree.kind === 'literal'"
      :tree="tree"
      :hoverable="hoverable"
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