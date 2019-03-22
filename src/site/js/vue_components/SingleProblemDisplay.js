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
        <svg height="100%" width="100%">
          <foreignObject height="100%" width="100%" style="overflow:auto">
            <SingleExpressionDisplay v-bind:tree="this.start"></SingleExpressionDisplay>
          </foreignObject>
        </svg>
      </div>
      <div class="col">Goal:
        <svg height="100%" width="100%">
          <foreignObject height="100%" width="100%" style="overflow:auto">
            <SingleExpressionDisplay v-bind:tree="this.goal"></SingleExpressionDisplay>
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