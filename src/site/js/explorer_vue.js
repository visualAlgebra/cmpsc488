import Vue from "vue";
import ExpressionTree from "./vue_components/ExpressionTree";
import NavigationBar from "./vue_components/NavigationBar";
import ExplorerPageTop from "./vue_components/ExplorerPageTop";
import ProblemsHolder from "./vue_components/ProblemsHolder";
import {get_problems_from_db} from "./database_management";

export const explorer_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <ExplorerPageTop></ExplorerPageTop>
    <ProblemsHolder
      v-if="display&&problemsToDisplay"
      :problems="problemsToDisplay"
      ></ProblemsHolder>
  </div>
  `, data(){
    return {
      display:false, problemsToDisplayCount: 1, problemsToDisplay: null,
    };
  }, mounted(){
    get_problems_from_db(this.problemsToDisplayCount, res=>{
      this.problemsToDisplay=res;
      this.display=true;
    });
  }, components: {
    ExpressionTree, NavigationBar, ExplorerPageTop, ProblemsHolder,
  },
});
