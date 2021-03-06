import ExpressionTree from "./ExpressionTree";
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
  name: "ManipulatorWindow",

  props: {
    tree: {
      required: true,
    },
    mouse: {
      required: true,
    },
    width: {
      required: false,
      default: "100%",
      type: String,
    },
    height: {
      required: false,
      default: "500px",
      type: String,
    },
    worldWidth: {
      required: false,
      default: 3000,
      type: Number,
    },
    worldHeight: {
      required: false,
      default: 1500,
      type: Number,
    },
    pulse: {
      default: false,
      type: Boolean,
    },
  },

  template: `
<div
  @dblclick="center()"
  class="manip-window-outline"
>
  <SvgPanZoom
    :maxZoom="5"
    :minZoom="0.5"
    :zoomScaleSensitivity="0.1"
    :dblClickZoomEnabled="false"
    @svgpanzoom="registerSvgPanZoom"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
    >
      <foreignObject :width="worldWidth" :height="worldHeight">
        <ExpressionTree
          v-if="tree"
          :tree="tree.clone()"
          :path="[]"
          interactive
          :mouse="mouse"
          :pulse="pulse"
        ></ExpressionTree>
      </foreignObject>
    </svg>
  </SvgPanZoom>
</div>
  `,

  data: () => ({
    svgpanzoom: null,
  }),

  mounted() {
    this.center();
  },

  methods: {
    registerSvgPanZoom(svgpanzoom) {
      this.svgpanzoom = svgpanzoom;
    },

    center() {
      this.svgpanzoom.center();
      this.svgpanzoom.resetZoom();
      this.svgpanzoom.pan({x:300, y:200});
    },
  },

  components: {
    ExpressionTree,
    SvgPanZoom,
  },
}
