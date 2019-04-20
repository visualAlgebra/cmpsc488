import * as M from "materialize-css";
import ManipulatorWindow from "./ManipulatorWindow";
import InsertionButtons from "./InsertionButtons";
import {Mouse} from "../gui";
import {ExpressionTree as JsExpressionTree} from "../expression_tree";

export default {

  name: "CreatorWindow",

  props: {
      useCreatedTree: Function,
      tree: {
        type: JsExpressionTree,
        default: null,
      },
  },

  template: `
<div
  id="creator-window-modal"
  class="modal grey darken-2 modal-fixed-footer big-modal"
>
  <div class="modal-content">
    <InsertionButtons
      :mouse="mouse"
      :clickFirstNode="workTree === null"
      :chooseRootNode="handleRootNodeSelection"
    ></InsertionButtons>
    <div
      v-if="workTree === null"
      class="row"
      style="display: flex;"
    >
      <div class="col" style="margin: auto; margin-top: 10%;">
        <h5
          class="grey-text lighten-2"
        >
          <i>
            Click on an element to start a tree...
          </i>
        </h5>
      </div>
    </div>
    <ManipulatorWindow
      v-if="instance && instance.isOpen && workTree !== null"
      :tree="workTree"
      :mouse="mouse"
      :height="'300px'"
    ></ManipulatorWindow>
  </div>
  <div class="modal-footer">
    <button
      @click="workTree = null"
      class="btn waves-effect"
    >
      Clear
      <i class="material-icons right">clear</i>
    </button>
    <button
      @click="closeModal"
      :class="closeButtonClasses"
    >
      Use as Start
      <i class="material-icons right">navigate_next</i>
    </button>
  </div>
</div>
  `,

  data() {
    return {
      instance: null,
      workTree: this.tree,
      mouse: null,
    };
  },

  created() {
    // Create a separate Mouse instance, don't use the Mouse instance from `creator_vue.js`!
    // This is so that `this.mouse` targets `this` (specifically, can access `this.workTree`).
    this.mouse = new Mouse(this);
  },

  computed: {
    closeButtonClasses() {
      return {
        "btn-flat": true,
        "green": true,
        "white-text": true,
        "waves-effect": true,
        disabled: this.workTree === null,
      };
    },
  },

  mounted() {
    const modal = document.getElementById('creator-window-modal');
    const options = { dismissable: false };
    M.Modal.init(modal, options);
    this.instance = M.Modal.getInstance(modal);
    setTimeout(() => { this.openModal(); }, 0);
  },

  methods: {
    openModal() {
      this.instance.open();
    },

    closeModal() {
      this.instance.close();
      this.useCreatedTree(this.workTree);
    },

    handleRootNodeSelection(tree) {
      this.workTree = tree;
    }
  },

  components: {
    ManipulatorWindow,
    InsertionButtons,
  },
};