import ExpressionTree from "./ExpressionTree";
import SingleExpressionDisplay from "./SingleExpressionDisplay";

export default {
  name: "SingleProblemDisplay", props: ["problemID", "start", "goal"], template: `
  <div class="container" style="border-style: solid;border-color: black;">Problem: {{problemID}}
    <a :href="this.url" class="secondary-content">
      <i class="material-icons">send</i>
    </a>
    <div class="row">
      <div class="col">Start:
        <svg height="300px" width="500px">
          <foreignObject height="300px" width="500px">
            <div class="myBox">
              <SingleExpressionDisplay v-bind:tree="this.start"></SingleExpressionDisplay>
            </div>
          </foreignObject>
        </svg>
      </div>
      <div class="col">Goal:
        <svg height="300px" width="500px">
          <foreignObject height="300px" width="500px">
            <div class="myBox">
              <SingleExpressionDisplay v-bind:tree="this.goal"></SingleExpressionDisplay>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  </div>  
  `, data(){
    return {
      url: "http://localhost:8080/manipulator/problems/"+this.problemID,
    };
  }, components: {
    ExpressionTree, SingleExpressionDisplay,
  },
};