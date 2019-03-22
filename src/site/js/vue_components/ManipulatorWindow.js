import ExpressionTree from "./ExpressionTree";

export default {
  name: "ManipulatorWindow",

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ExpressionTree
      v-if="workingExpressionTree"
      :tree="workingExpressionTree"
      hoverable="true"
    ></ExpressionTree>
  </div>
  `,

  data() {
    return {
      workingExpressionTree: null,
    };
  },

  components: {
    ExpressionTree,
  },
}