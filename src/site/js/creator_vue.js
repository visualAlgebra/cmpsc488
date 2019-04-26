import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import CreatorSpecificActionButtons from "./vue_components/CreatorSpecificActionButtons";
import CreatorNavigationButtons from "./vue_components/CreatorNavigationButtons";
import ManipulatorWindow from "./vue_components/ManipulatorWindow";
import {getProblemFromDBVue} from "./display_feature";
import {Deserialize} from "./expression_tree";
import {Mouse} from "./gui";
import InvalidPage from "./vue_components/InvalidPage";
import {addListenerForUser} from "./user_system";
import PublishProblemModal from "./vue_components/PublishProblemModal";
import CreatorWindow from "./vue_components/CreatorWindow";
import {addHistoryEntry, clearHist} from "./history_nav";

export const creator_vue = new Vue({
  name: "Root",

  el: "#vue-app",

  template: `
<div>
  <NavigationBar
    :user="userStruct"
    :oauth_user_getter="oauth_user_getter"
    :oauth_user_remover="oauth_user_remover"
    :logged="logged"
  ></NavigationBar>
  <InvalidPage v-if="!display"></InvalidPage>
  <CreatorNavigationButtons
    v-if="display"
    v-bind:dataFunc="getTreeData"
    v-bind:cvMounted="mounted"
    v-bind:setWorkTree="setWorkTree"
    v-bind:setStartTree="setStartTree"
    :stage="stage"
    :clearTree="clearTree"
    :problemIsSavable="problemIsSavable()"
    :editStartTree="editStartTree"
    :saveProblem="saveProblem"
  ></CreatorNavigationButtons>
  <CreatorSpecificActionButtons
    v-if="display"
    :mouse="mouse"
    :enterPulseMode="() => { pulse = true; }"
    :exitPulseMode="() => { pulse = false; }"
  ></CreatorSpecificActionButtons>
  <ManipulatorWindow
    v-if="display&&workTree"
    :tree="workTree"
    :mouse="mouse"
    :pulse="pulse"
  ></ManipulatorWindow>
  <CreatorWindow
    v-if="stage === 'build'"
    :tree="workTree"
    :useCreatedTree="setStartTree"
  ></CreatorWindow>
  <CreatorWindow
    v-if="displayInsertionCreatorModal"
    :mouse="mouse"
    :useCreatedTree="useTreeToIdentityBalance"
  ></CreatorWindow>
  <PublishProblemModal
    v-if="finish"
    :closeFinish="closeFinish"
    :createdProblem="createdProblem"
    :userStruct="userStruct"
  ></PublishProblemModal>
</div>
  `,

  data: () => ({
    stage: null,
    display: true,
    workTree: null,
    startTree: null,
    createdProblem: [null, null],
    desc: "",
    time: "",
    mouse: null,
    lessonID: null,
    userStruct: null,
    logged: false,
    finish: false,
    problemID: null,
    pulse: false,
    insertionPoint: null,
    displayInsertionCreatorModal: false,
    mounted: false
  }),

  created() {
    addListenerForUser(this.oauth_user_getter);
    this.mouse = new Mouse(this);
  },

  mounted() {
    M.AutoInit();
    if (this.getURL() !== null) {
      getProblemFromDBVue(this.problemID, this.distribute);
    } else {
      this.stage = "build";
    }
  },

  methods: {
    distribute(res, code) {
      if (code === 2) { // Start
        this.workTree = Deserialize(res);
        this.startTree = this.workTree.clone();
        this.display = true;
        this.stage = "manip";
      }
    },

    problemIsSavable() {
      return this.startTree !== null
          && this.workTree !== null
          && !this.startTree.equals(this.workTree);
    },

    oauth_user_getter(user) {
      this.userStruct = user;
      this.logged = true;
    },

    oauth_user_remover() {
      this.userStruct = null;
      this.logged = false;
    },

    getURL() {
      let argArr = (window.location.href).split('/');
      if (argArr.length >= 5) {
        this.problemID = argArr[4];
        if (argArr[6] !== undefined) {
          this.lessonID = argArr[6];
        }
        if (argArr[5] !== undefined) {
          this.problemID += '/' + argArr[5];
        }
      } else {
        return null;
      }
      return this.problemID;
    },

    closeFinish(res) {
      this.finish = false;
      window.location.href = "http://localhost:8080/algebra/problems/" + res
    },

    clearTree() {
      this.workTree = null;
    },

    setStartTree(tree) {
      this.startTree = tree.clone(); // Save a copy as the start tree.
      this.workTree = tree;
      this.stage = "manip";
      this.mounted=true;
    }, setWorkTree(tree){
      if(tree!==null) {
        this.workTree = Deserialize(tree);
      }
    },

    editStartTree() {
      this.workTree = this.startTree; // We can reuse startTree obj since workTree is overwritten.
      this.stage = "build";
      this.mounted=false;
      clearHist();
    },

    saveProblem() {
      this.createdProblem = [this.startTree.toString(), this.workTree.toString()];
      this.finish = true;
      window.setTimeout(() => {
        const modal = document.getElementById('finishProblemModal');
        M.Modal.getInstance(modal).open();
      }, 0);
    }, getTreeData(){
      return [this.workTree.toString(), null];
    },

    insertionQuadrantSelected(insertionPoint) {
      this.pulse = false;
      this.displayInsertionCreatorModal = true;
      this.insertionPoint = insertionPoint;
    },

    useTreeToIdentityBalance(tree) {
      this.mouse.identityBalance(tree, this.insertionPoint);
    },
  },

  components: {
    NavigationBar,
    CreatorSpecificActionButtons,
    CreatorNavigationButtons,
    ManipulatorWindow,
    InvalidPage,
    PublishProblemModal,
    CreatorWindow,
  },
});
