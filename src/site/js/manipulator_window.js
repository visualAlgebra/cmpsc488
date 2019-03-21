import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";

export const manipulatorWindow = new Vue({
  name: "Root",

  el: "#vueCanvasContainer",

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
});
