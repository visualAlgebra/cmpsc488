import SingleExpressionDisplay from "./SingleExpressionDisplay";

export default {
  name: "GoalExpression",

  props: {
    tree: Array,
  },

  template: `
    <div>
      <a
        id="goalBtn"
        @click="openModal"
        class="waves-effect waves-light btn btn-floating"
      >Goal</a>
      <div id="goalModal" class="modal modal-fixed-footer">
        <div class="modal-content">
          <SingleExpressionDisplay
            v-if="modalInstance && modalInstance.isOpen"
            :tree="tree"
            height="400px"
            worldHeight="2000"
          ></SingleExpressionDisplay>
        </div>
        <div class="modal-footer">
          <a
            class="waves-effect waves-green btn-flat"
            @click="closeModal"
          >Close</a>
        </div>
      </div>
    </div>
  `,

  data: () => ({
    modalInstance: null,
    displayExpression: false,
  }),

  methods: {
    openModal() {
      this.modalInstance.open();
    },

    closeModal() {
      this.modalInstance.close();
    },
  },

  mounted() {
    const modal = document.getElementById("goalModal");
    M.Modal.init(modal);
    this.modalInstance = M.Modal.getInstance(modal);
  },

  components: {
    SingleExpressionDisplay
  }
};
