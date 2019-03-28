import {singleExpressionDecompression} from "../display_feature";
import {Deserialize} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
  name: "SingleExpressionDisplay", props: ["tree"], template: `
  <div>
    <SvgPanZoom :maxZoom="3" :minZoom="0.5" :zoomScaleSensitivity="0.1" :dblClickZoomEnabled="false" @svgpanzoom="registerSvgPanZoom">
      <svg width="100%" style="border-style:solid; border-color: white; border-width:1px">
        <foreignObject height="500" width="500">
          <ExpressionTree v-if="displayPage" v-bind:tree="workingExpressionTree">
          </ExpressionTree>
        </foreignObject>
      </svg>
    </SvgPanZoom>
  </div>
  `, data() {
    return {
      workingExpressionTree: null, display: false,
    };
  }, mounted() {
    singleExpressionDecompression(this.tree, res => {
      this.workingExpressionTree = Deserialize(res);
      this.display = true;
    });
  }, computed: {
    displayPage: function () {
      if (this.display === true) {
        return true;
      }
      return false;
    },
  }, components: {
    ExpressionTree,SvgPanZoom,
  },
};