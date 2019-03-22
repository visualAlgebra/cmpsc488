import ExpressionTree from "./ExpressionTree";

export default {
  name: "ManipulatorWindow",

  props: ["tree"],

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ExpressionTree
      v-if="tree"
      :tree="tree"
      hoverable="true"
    ></ExpressionTree>
  </div>
  `,

  components: {
    ExpressionTree,
  },
}