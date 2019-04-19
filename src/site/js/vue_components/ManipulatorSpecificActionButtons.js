import * as M from "materialize-css";
import {Mouse, MouseMode} from "../gui";
import CreatorWindow from "./CreatorWindow";

export default {
  name: "ManipulatorSpecificActionButtons",

  props: {
    mouse: Mouse,
    useCreatedTree: Function,
    setPulseMode: Function,
    displayCreatorMenu: Boolean,
  },

  template: `
<div>
  <section>
    <form action="#">
      <div class="row">
        <div class="col s12">
          <ul class="tabs blue-grey waves-light">
            <li id="1" class="tab col s3 white-text active">
              <a class="white-text" v-on:click="generalManipulation()">Transform</a>
            </li>
            <li id="2" class="tab col s3">
              <a class="white-text" v-on:click="mergeLiterals()">Merge Atoms</a>
            </li>
            <li id="3" class="tab col s3">
              <a class="white-text" v-on:click="distribution()">Distribute</a>
            </li>
            <li id="4" class="tab col s3">
              <a class="white-text" v-on:click="insert()">Insert</a>
            </li>
          </ul>
        </div>
      </div>
    </form>
  </section>
  <CreatorWindow
    v-if="displayCreatorMenu"
    :useCreatedTree="useCreatedTree"
  ></CreatorWindow>
</div>  
  `,

  methods: {
    generalManipulation(){
      this.mouse.mode = MouseMode.Manipulation;
    },

    mergeLiterals(){
      this.mouse.mode = MouseMode.MergingLiterals;
    },

    distribution(){
      this.mouse.mode = MouseMode.Distribution;
    },

    insert(){
      const DISPLAY_LENGTH = 7 * 1000;
      M.toast({
        html: "Select a quadrant...",
        displayLength: DISPLAY_LENGTH,
      });
      this.mouse.mode = MouseMode.SelectingInsertionQuadrant;
      this.setPulseMode(true);
    },
  },

  mounted(){
    M.AutoInit();
    this.generalManipulation();
  },

  components: {
    CreatorWindow,
  },
};