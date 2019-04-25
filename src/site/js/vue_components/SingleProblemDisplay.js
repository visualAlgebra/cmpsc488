import ExpressionTree from "./ExpressionTree";
import SingleExpressionDisplay from "./SingleExpressionDisplay";

export default {
  name: "SingleProblemDisplay", props: ["problemID", "start", "goal", "deleteProblem"], template: `
  <div class="container single-problem-display">
    <h5 class="center-align">Problem: {{problemID}}</h5>
    <a :href="edit" class="secondary-content">
      <i class="material-icons">rotate_left</i>
    </a>
    <a :href="url" class="secondary-content">
      <i class="material-icons">send</i>
    </a>
    <a class="secondary-content dropdown-trigger" :data-target="targetID">
      <i class="material-icons">delete_forever</i>
    </a>
    <ul :id="targetID" class='dropdown-content'>
      <li><a>Are you sure?</a></li>
      <li><a>No</a></li>
      <li><a v-on:click="deleteProb">Yes</a></li>
    </ul>
    <div class="row">
      <div class="col">Start:
        <SingleExpressionDisplay v-bind:tree="this.start"></SingleExpressionDisplay>
      </div>
      <div class="col">Goal:
        <SingleExpressionDisplay v-bind:tree="this.goal"></SingleExpressionDisplay>
      </div>
    </div>
  </div>  
  `, data(){
    return {
      url: "http://localhost:8080/manipulator/problems/"+this.problemID,
      edit: "http://localhost:8080/creator/"+this.problemID,
      targetID: "dataP"+this.problemID
    };
  }, methods:{
    deleteProb(){
      this.deleteProblem(this.problemID);
    }
  }, components: {
    ExpressionTree, SingleExpressionDisplay,
  },
};
