import ExpressionTree from "./ExpressionTree";
import SingleExpressionDisplay from "./SingleExpressionDisplay";
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
  name: "SingleProblemDisplay", props: ["problemID", "start", "goal"], template: `
  <div class="container" style="border-style: solid;border-color: black;">Problem: {{problemID}}
    <a :href="this.url" class="secondary-content">
      <i class="material-icons">send</i>
    </a>
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
    };
  }, methods: {
    registerSvgPanZoom(svgpanzoom) {
      this.svgpanzoom = svgpanzoom;
    },
  }, mounted(){
  }, components: {
    ExpressionTree, SingleExpressionDisplay,
  },
};