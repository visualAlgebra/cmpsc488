import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import {Variable} from "./expression_tree";
import ToolBar from "./vue_components/ToolBar";

export const creator_page = new Vue({
  name: "Root",

  el: "#vueCanvasContainer",

  template: `
  <div xmlns="http://www.w3.org/1999/xhtml">
    <ToolBar></ToolBar>
    <ExpressionTree v-if="workingExpressionTree" :tree="workingExpressionTree"></ExpressionTree>
  </div>
  `,

  data() {
    return {
      workingExpressionTree: new Variable(6),
    };
  },

  components: {
    ExpressionTree,
    ToolBar,
  },
});
