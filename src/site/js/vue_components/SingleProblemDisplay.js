import ExpressionTree from "./ExpressionTree";
import SingleExpressionDisplay from "./SingleExpressionDisplay";

export default {
  name: "SingleProblemDisplay", props: ["problemID", "start", "goal", "deleteProblem", "type"], template: `
  <div class="container single-problem-display">
  
    <h5 class="center-align" style="font-weight: bolder;">
      <a :href="url">{{problemID}}</a>
    </h5>
    
    <div class="row">
      <div class="col">
        <h6>Start</h6>
        <SingleExpressionDisplay v-bind:tree="this.start"></SingleExpressionDisplay>
      </div>
      <div class="col">
        <h6>Goal</h6>
        <SingleExpressionDisplay v-bind:tree="this.goal"></SingleExpressionDisplay>
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <a v-bind:href="url" class="secondary-content btn">
          Play <i class="material-icons right">play_arrow</i>
        </a>
      </div>
      <div class="col">
        <a v-if="type!=='explorer'" v-bind:href="edit" class="secondary-content btn">
          Edit <i class="material-icons right">edit</i>
        </a>
      </div>
      <div class="col">
        <a v-if="type!=='explorer'" class="secondary-content btn dropdown-trigger" :data-target="targetID">
          Delete <i class="material-icons right">delete_forever</i>
        </a>
        <ul v-if="type!=='explorer'" v-bind:id="targetID" class='dropdown-content'>
          <li><a>Are you sure?</a></li>
          <li><a>No</a></li>
          <li><a v-on:click="deleteProb">Yes</a></li>
        </ul>
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
