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
        <SvgPanZoom :maxZoom="3" :minZoom="0.5" :zoomScaleSensitivity="0.1" :dblClickZoomEnabled="false" @svgpanzoom="registerSvgPanZoom">
          <svg width="100%" style="border-style:solid; border-color: white; border-width:1px">
            <foreignObject height="500" width="500">
              <SingleExpressionDisplay v-bind:tree="this.start"></SingleExpressionDisplay>
            </foreignObject>
          </svg>
        </SvgPanZoom>
      </div>
      <div class="col">Goal:
        <SvgPanZoom :maxZoom="3" :minZoom="0.5" :zoomScaleSensitivity="0.1" :dblClickZoomEnabled="false" @svgpanzoom="registerSvgPanZoom">
          <svg width="100%" style="border-style:solid; border-color: white; border-width:1px">
            <foreignObject height="500" width="500">
              <SingleExpressionDisplay v-bind:tree="this.goal"></SingleExpressionDisplay>
            </foreignObject>
          </svg>
        </SvgPanZoom>
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
    ExpressionTree, SingleExpressionDisplay,SvgPanZoom,
  },
};