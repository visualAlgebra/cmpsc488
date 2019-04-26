import {singleExpressionDecompression} from "../display_feature";
import {Deserialize} from "../expression_tree";
import ExpressionTree from "./ExpressionTree";
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
  name: "SingleExpressionDisplay",

  props: {
    tree: {
      required: true,
    },
    height: {
      required: false,
      default: "100%",
      type: String,
    },
    width: {
      required: false,
      default: "100%",
      type: String,
    },
    worldHeight: {
      required: false,
      default: "1000",
      type: String,
    },
    worldWidth: {
      required: false,
      default: "3000",
      type: String,
    },
  },

  template: `
  <div>
    <SvgPanZoom
      :zoomScaleSensitivity="0.1"
      @svgpanzoom="registerSvgPanZoom"
    >
      <svg
        :height="height"
        :width="width"
        style="border-style:solid; border-color: rgba(200,200,200,0.2); border-width: 0.5rem; border-radius: 1rem;"
      >
        <foreignObject
          :height="worldHeight"
          :width="worldWidth"
        >
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
