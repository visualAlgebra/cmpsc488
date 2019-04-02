import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import InvalidPage from "./vue_components/InvalidPage";
import ManipulatorNavigationButtons from "./vue_components/ManipulatorNavigationButtons";
import ManipulatorSpecificActionButtons from "./vue_components/ManipulatorSpecificActionButtons";
import {getProblemFromDBVue, singleExpressionDecompression} from "./display_feature";
import {Deserialize} from "./expression_tree";
import ExpressionTree from "./vue_components/ExpressionTree";
import SingleExpressionDisplay from "./vue_components/SingleExpressionDisplay";
import ManipulatorWindow from "./vue_components/ManipulatorWindow";
import GoalExpression from "./vue_components/GoalExpression";
import * as M from "materialize-css";

export const manipulator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <ManipulatorNavigationButtons v-if="display&&workTree&&goalTreeStr" v-bind:dataFunc="getTreeData"></ManipulatorNavigationButtons>
    <ManipulatorSpecificActionButtons v-if="display"></ManipulatorSpecificActionButtons>
    <ManipulatorWindow v-if="display&&workTree" :tree="workTree"></ManipulatorWindow>
    <GoalExpression
      v-if="display&&goalTree"
      :tree="goalTree"
    ></GoalExpression>
  </div>
  `, data(){
    return {
      display: false, goalTree: null, workTree:null, dbInfo:0, problemID: "", desc:"", time:"", goalTreeStr: null,
    };
  }, mounted(){
    M.AutoInit();
    if(this.getURL()===null){
      return;
    }
    getProblemFromDBVue(this.problemID,this.distribute);
  }, methods: {
    getURL(){
      let problem=(window.location.href).substr((window.location.href).indexOf('/manipulator'));
      if(problem.indexOf('/manipulator/problems')=== -1||problem==='null'||problem===''||problem==='undefined'){
        return null;
      }
      this.problemID=problem.substring(problem.indexOf('/manipulator')+'/manipulator/problems/'.length, problem.length);
      return this.problemID;
    }, distribute(res, code){
      if(code===1){
        this.desc=res.description;
        this.time=res.timeCreated;
      }else if(code===2){//start
        this.workTree=Deserialize(res);
      }else if(code===3){//goal
        this.goalTree=res;
        singleExpressionDecompression(this.goalTree, res=>{
          this.goalTreeStr=res;
        });
      }
      if(++this.dbInfo===3){
        this.display=true;
      }
    }, getTreeData(){
      return [this.workTree.toString(), this.goalTreeStr.toString()];
    }
  }, components: {
    NavigationBar, InvalidPage, ManipulatorNavigationButtons, ManipulatorSpecificActionButtons, ExpressionTree, SingleExpressionDisplay, ManipulatorWindow, GoalExpression
  },
});
