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
import {addHistoryEntry, clearHist} from "./history_nav";
import {Mouse} from "./gui";
import {addListenerForUser} from "./user_system";
import WinModal from "./vue_components/WinModal";

export const manipulator_vue = new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth_user_getter="oauth_user_getter" v-bind:oauth_user_remover="oauth_user_remover" v-bind:logged="logged"></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <ManipulatorNavigationButtons v-if="display&&workTree&&goalTreeStr" v-bind:dataFunc="getTreeData" v-bind:restart="restart" v-bind:setWorkTree="setWorkTree" v-bind:setWorkTreeWithHistory="setWorkTreeWithHistory" v-bind:lessonID="lessonID" v-bind:problemID="problemID" v-bind:setNextProblemURL="setNextProblemURL"></ManipulatorNavigationButtons> 
    <ManipulatorSpecificActionButtons v-if="display" :mouse="mouse"></ManipulatorSpecificActionButtons>
    <ManipulatorWindow v-if="display&&workTree" :tree="workTree" :mouse="mouse"></ManipulatorWindow>
    <GoalExpression
      v-if="display&&goalTree"
      :tree="goalTree"
    ></GoalExpression>
    <WinModal v-show="win" v-bind:navigateNextProblem="navigateNextProblem"></WinModal> 
  </div>
  `, data(){
    return {
      display: false, goalTree: null, workTree:null, dbInfo:0, problemID: "", desc:"", time:"", goalTreeStr: null, workTreeData:null, mouse: new Mouse(this), lessonID: null, userStruct:null, logged:false, win:false, nextProblemURL:null,
    };
  }, created(){
    addListenerForUser(this.oauth_user_getter);
  }, mounted(){
    M.AutoInit();
    if(this.getURL()!==null){
      getProblemFromDBVue(this.problemID,this.distribute);
    }
  }, methods: {
    resolveWin(val){
      if(val) {
        this.win=true;
        window.setTimeout(() => {M.Modal.getInstance(document.getElementById('winModal')).open(); } , 0);
      }
    }, getURL(){
      let argArr=(window.location.href).split('/');
      if(argArr.length===6) {
        this.problemID=argArr[5];
      }else if(argArr.length===7) {
        this.problemID=argArr[5]+'/'+argArr[6];
      }else if(argArr.length===8) {
        this.problemID=argArr[5]+'/'+argArr[6];
        this.lessonID=argArr[7];
      }else{
        return null;
      }
      return this.problemID;
    }, distribute(res, code){
      if(code===1){
        this.desc=res.description;
        this.time=res.timeCreated;
      }else if(code===2){//start
        this.workTree=Deserialize(res);
        this.workTreeData=res;
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
    }, setWorkTree(tree){
      if(tree!==null) {
        this.workTree = Deserialize(tree.toString());
      }
    }, setWorkTreeWithHistory(tree, actionName){
      if(tree!==null) {
        this.workTree = Deserialize(tree.toString());
        addHistoryEntry(tree.toString(), actionName);
      }
    }, restart(){
      this.workTree=Deserialize(this.workTreeData);
      clearHist();
    }, setNextProblemURL(url){
      this.nextProblemURL=url+this.lessonID;
    }, navigateNextProblem(){
      if(this.nextProblemURL!==null) {
        window.location.href = this.nextProblemURL;
      }
    }, oauth_user_getter(user) {
      this.userStruct = user;
      this.logged = true;
    }, oauth_user_remover(){
      this.usersStruct=null;
      this.logged=false;
    },
  }, components: {
    NavigationBar,
    InvalidPage,
    ManipulatorNavigationButtons,
    ManipulatorSpecificActionButtons,
    ExpressionTree,
    SingleExpressionDisplay,
    ManipulatorWindow,
    GoalExpression,
    WinModal,
  },
});
