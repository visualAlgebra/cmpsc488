import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import IndexPageViewVue from "./vue_components/IndexPageViewVue";
import {post_problem_from_site} from "./database_management";
import {createDummyProblem} from "./random_expression_creator";

export const index_vue = new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar></NavigationBar>
    <IndexPageViewVue></IndexPageViewVue>
  </div>
  `,
  // mounted() {
  //   console.log("here");
  //   this.TESTPOST();
  // }, methods: {
  //   TESTPOST() {
  //     let temp = createDummyProblem(20, 2);
  //     console.log(temp);
  //     post_problem_from_site(temp);
  //   }
  // },
  components:
    {
      NavigationBar, IndexPageViewVue,
    }
  ,
});

