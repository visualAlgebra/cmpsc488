import * as M from "materialize-css";
import SingleExpressionDisplay from "./SingleExpressionDisplay";
import {compress_string_js, ProblemInfo, randomGoalGeneratorNoArr, randomStartGenerator} from "../expression_tree";
import {post_problem_from_site} from "../database_management";

export default {
  name: "ExplorerAIGenerationModal", props:["userStruct"], template: `
    <div id="generationModal" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4 class="black-text">Generate Random Expression</h4>
        <div class="switch">
          <label>Basic
          <input v-on:click="state=!state" type="checkbox">
          <span class="lever"></span>Advanced
          </label>
        </div>
        <div v-if="!state">
          <label>Select from 1 to 10 the difficulty:</label>
          <form>
            <p class="range-field">
              <input type="range" id="basicSlider" min="1" max="10" step="1" value="1">
            </p>
          </form>
        </div>
        <div v-if="state">
          <label>Select size of tree to start with:</label>
          <form>
            <p class="range-field">
              <input type="range" id="num_nodes" min="10" max="30">
            </p>
          </form>
          <label>Select complexity of goal expression:</label>
          <form>
            <p class="range-field">
              <input type="range" id="num_actions" min="10" max="100">
            </p>
          </form>
        </div>
        <a class="tab waves-effect waves-light btn" v-on:click="fillExpressions()">
          <i class="material-icons left">autorenew</i>
          Generate new expression
        </a>
        <SingleExpressionDisplay v-if="display&&workTree" v-bind:tree="workTree"></SingleExpressionDisplay>
        <SingleExpressionDisplay v-if="display&&goalTree" v-bind:tree="goalTree"></SingleExpressionDisplay>
      </div>
      <div class="modal-footer">
        <a class="waves-effect waves-green btn-flat" v-on:click="submitProblem()">Submit</a>
      </div>
    </div>
  `, data(){
    return{
      state:false, display:false, problemInformation:null, basicAmts:[10,12,14,16,18,20,22,24,26,28], basicActs:[10,12,14,16,18,20,22,24,26,28], workTree:null, goalTree:null, val:0,
    }
  }, mounted() {
    M.AutoInit();
  }, methods:{
    getID(){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }, fillExpressions() {
      if (!this.state) {
        this.val = parseInt(document.getElementById('basicSlider').value);
        console.log(this.val+" sadasdasdas");
        if (this.val < 1 || this.val > 10) {
          alert("Failed to create problem, webpage was modified");
          this.display = false;
          return;
        }
        this.workTree = randomStartGenerator(this.basicAmts[this.val]);
        this.goalTree = randomGoalGeneratorNoArr(this.workTree, this.basicActs[this.val]);
      } else {
        let num_nodes = parseInt(document.getElementById('num_nodes').value);
        console.log(num_nodes+" sadasdasdas");
        let num_actions = parseInt(document.getElementById('num_actions').value);
        console.log(num_actions+" sadasdasdas");
        if (num_nodes < 10 || num_nodes >= 30 || num_actions < 10 || num_actions > 100) {
          alert("Failed to create problem, webpage was modified");
          this.display = false;
          return;
        }
        this.workTree = randomStartGenerator(num_nodes);
        this.goalTree = randomGoalGeneratorNoArr(this.workTree, num_actions);
      }
      this.display = true;
    }, distributeStart(res){
      this.problemInformation.expression_start=res;
      compress_string_js(this.goalTree, this.distributeGoal);
    }, distributeGoal(res){
      this.problemInformation.expression_goal=res;
      this.problemInformation.description="Auto-generated problem from explorer page";
      post_problem_from_site(this.problemInformation, this.userStruct, this.redirectCallback);
    }, redirectCallback(res){
      console.log(res);
      //window.location.href=res;
    }, submitProblem(){
      this.problemInformation=new ProblemInfo(this.getID());
      compress_string_js(this.workTree, this.distributeStart);
    }
  }, components:{
    SingleExpressionDisplay,
  }
};
