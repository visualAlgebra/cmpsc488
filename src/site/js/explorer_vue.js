import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import {Variable} from "./expression_tree";
import NavigationBar from "./vue_components/NavigationBar";
import ExplorerPageTop from "./vue_components/ExplorerPageTop";
import ExplorerPageProblems from "./vue_components/ExplorerPageProblems";

export const explorer = new Vue({
  name: "Root",

  el: "#vue-app",

  template: `
  <div>
    <NavigationBar></NavigationBar>
    <ExplorerPageTop></ExplorerPageTop>
    <ExplorerPageProblems></ExplorerPageProblems>
  </div>
  `,

  data() {
    return {
      workingExpressionTree: new Variable(6),
    };
  },

  components: {
    ExpressionTree,
    NavigationBar,
    ExplorerPageTop,
    ExplorerPageProblems,
  },
});
