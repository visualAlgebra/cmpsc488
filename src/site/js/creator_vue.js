import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import ManipulatorNavigationButtons from "./vue_components/ManipulatorNavigationButtons";
import ManipulatorSpecificActionButtons from "./vue_components/ManipulatorSpecificActionButtons";
import CreatorSpecificActionButtons from "./vue_components/CreatorSpecificActionButtons";
import CreatorNavigationButtons from "./vue_components/CreatorNavigationButtons";
import ManipulatorWindow from "./vue_components/ManipulatorWindow";

export const creator_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-if="displayPage"></NavigationBar>
    <CreatorNavigationButtons v-if="displayPage"></CreatorNavigationButtons>
    <CreatorSpecificActionButtons v-if="displayPage"></CreatorSpecificActionButtons>
    <ManipulatorWindow v-if="displayPage&&workTree" :tree="workTree"></ManipulatorWindow>
    <p>Welcome from vue</p>
  </div>
  `, data(){
    return {
      display: false, workTree:null, dbInfo:0, problemID: "", desc:"", time:"", goalTreeStr: null,
    };
  }, computed: {
    displayPage: function(){
      if(this.display===true){
        return true;
      }
      return false;
    }
  }, components: {
    NavigationBar, ManipulatorNavigationButtons, ManipulatorSpecificActionButtons, CreatorSpecificActionButtons, CreatorNavigationButtons, ManipulatorWindow,
  },
});
