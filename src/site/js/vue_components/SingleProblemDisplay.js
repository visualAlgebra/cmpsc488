import ExpressionTree from "./ExpressionTree";
import SingleExpressionDisplay from "./SingleExpressionDisplay";

export default {
  name: "SingleProblemDisplay", props: ["problemID", "start", "goal"], template: `
  <div class="container" style="border-style: solid;border-color: green;">Problem: {{problemID}}
    <a :href="this.url" class="secondary-content">
      <i class="material-icons">send</i>
    </a>
    <div class="row">
      <div class="col">Start:
        <svg>
          <foreignObject>
            <div class="myBox">
              <SingleExpressionDisplay v-bind:tree="this.start"></SingleExpressionDisplay>
            </div>
          </foreignObject>
        </svg>
      </div>
      <div class="col">Goal:
        <svg>
          <foreignObject>
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