import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import NavigationBar from "./vue_components/NavigationBar";
import ExplorerPageTop from "./vue_components/ExplorerPageTop";
import ExplorerPageProblemsHolder from "./vue_components/ExplorerPageProblemsHolder";
import {get_problems_from_db} from "./database_management";

export const explorer_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <ExplorerPageTop></ExplorerPageTop>
    <ExplorerPageProblemsHolder
      v-if="problemsToDisplay"
      :problems="problemsToDisplay"
      ></ExplorerPageProblemsHolder>
  </div>
  `, data(){
    return {
      problemsToDisplayCount: 1, problemsToDisplay: null,
    };
  }, mounted(){
    get_problems_from_db(this.problemsToDisplayCount, res=>this.problemsToDisplay=res);
  }, components: {
    ExpressionTree, NavigationBar, ExplorerPageTop, ExplorerPageProblemsHolder,
  },
});
