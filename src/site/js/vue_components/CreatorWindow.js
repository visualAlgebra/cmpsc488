import * as M from "materialize-css";
import ManipulatorWindow from "./ManipulatorWindow";
import InsertionButtons from "./InsertionButtons";

export default {

  name: "CreatorWindow",

  props: [
      "useCreatedTree",
      "mouse",
      "tree",
  ],

  template: `
<div
  id="creator-window-modal"
  class="modal grey darken-2 modal-fixed-footer big-modal"
>
  <div class="modal-content">
    <InsertionButtons
      :mouse="mouse"
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
      :height="'200px'"
    ></ManipulatorWindow>
  </div>
  <div class="modal-footer">
    <button
      @click="closeModal"
      :class="closeButtonClasses"
    >
      Use as Start
    </button>
  </div>
</div>
  `,

  data() {
    return {
      instance: null,
      workTree: this.tree,
    };
  },

  computed: {
    closeButtonClasses() {
      const disabled = this.tree === null;
      return {
        "waves-effect": true,
        "waves-green": true,
        "btn-flat": true,
        disabled,
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
  },

  components: {
    ManipulatorWindow,
    InsertionButtons,
  },
};