import {singleExpressionDecompression} from "../display_feature";
import {Deserialize} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
  name: "SingleExpressionDisplay", props: ["tree"], template: `
  <div>
    <SvgPanZoom :zoomScaleSensitivity="0.1" @svgpanzoom="registerSvgPanZoom" :fit="false">
      <svg height="100%" width="100%" style="border-style:solid; border-color: white; border-width:1px">
        <foreignObject height="500" width="2000">
          <ExpressionTree v-if="display" v-bind:tree="workingExpressionTree"></ExpressionTree>
        </foreignObject>
      </svg>
    </SvgPanZoom>
  </div>
  `, data() {
    return {
      workingExpressionTree: null, display: false,
    };
  }, methods: {
    registerSvgPanZoom(svgpanzoom) {
      this.svgpanzoom = svgpanzoom;
    },
  }, mounted() {
    if(this.tree[0]===undefined){
      this.workingExpressionTree=this.tree.clone();
      this.display=true;
    }else {
      singleExpressionDecompression(this.tree, res => {
        this.workingExpressionTree = Deserialize(res);
        this.display = true;
      });
    }
  }, components: {
    ExpressionTree, SvgPanZoom,
  },
};
