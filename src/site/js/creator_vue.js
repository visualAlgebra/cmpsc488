import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import ManipulatorNavigationButtons from "./vue_components/ManipulatorNavigationButtons";
import ManipulatorSpecificActionButtons from "./vue_components/ManipulatorSpecificActionButtons";
import CreatorSpecificActionButtons from "./vue_components/CreatorSpecificActionButtons";
import CreatorNavigationButtons from "./vue_components/CreatorNavigationButtons";
import ManipulatorWindow from "./vue_components/ManipulatorWindow";
import * as M from "materialize-css";

export const creator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-if="displayPage"></NavigationBar>
    <CreatorNavigationButtons
      v-if="displayPage"
      :goToNextStage="goToNextStage"
      :stage="stage"
    ></CreatorNavigationButtons>
    <CreatorSpecificActionButtons v-if="displayPage"></CreatorSpecificActionButtons>
    <ManipulatorWindow v-if="displayPage&&workTree" :tree="workTree"></ManipulatorWindow>
  </div>
  `,
  data: () => ({
    stage: "build",
    display: false,
    workTree: null,
    startTree: null,
    dbInfo:0,
    problemID: "",
    desc:"",
    time:"",
    goalTreeStr: null,
  }),
  mounted() {
    M.AutoInit();
    this.display = true;
  },
  methods: {
    goToNextStage() {
      this.stage = "manip";
      this.startTree = this.workTree.toString();
    },
  },
  computed: {
    displayPage: function(){
      return this.display;
    }
  },
  components: {
    NavigationBar, CreatorSpecificActionButtons, CreatorNavigationButtons, ManipulatorWindow,
  },
});
