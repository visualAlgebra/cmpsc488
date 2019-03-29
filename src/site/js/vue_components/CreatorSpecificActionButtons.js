import * as M from "materialize-css";
import {mouse, MouseMode} from "../gui";
import InsertButtons from "./InsertButtons";

export default {
  name: "CreatorSpecificActionButtons",

  template: `
<div>
  <section>
    <form action="#">
      <div class="row">
        <div class="col s12">
          <ul class="tabs blue-grey waves-light">
            <li id="1" class="tab col s3 white-text active">
              <a class="white-text" @click="generalManipulation()">General Manipulation</a>
            </li>
            <li id="2" class="tab col s3">
              <a class="white-text" @click="mergeLiterals()">Merging Literals</a>
            </li>
            <li id="3" class="tab col s3">
              <a class="white-text" @click="distribution()">Distribution</a>
            </li>
            <li id="4" class="tab col s3">
              <a class="white-text" @click="insert()">Insert</a>
            </li>
          </ul>
        </div>
      </div>
    </form>
  </section>
  <InsertButtons v-if="inInsertMode"></InsertButtons>
</div>  
  `,

  data: () => ({
    // Needed because mutating `mouse.mode` doesn't trigger a Vue update.
    mouseMode: MouseMode.Manipulation,
  }),

  computed: {
    inInsertMode() {
      return this.mouseMode === MouseMode.Insertion;
    },
  },

  methods: {
    generalManipulation(){
      mouse.mode = MouseMode.Manipulation;
      this.mouseMode = MouseMode.Manipulation;
    },
    mergeLiterals(){
      mouse.mode = MouseMode.MergingLiterals;
      this.mouseMode = MouseMode.MergingLiterals;
    },
    distribution(){
      mouse.mode = MouseMode.Distribution;
      this.mouseMode = MouseMode.Distribution;
    },
    insert(){
      mouse.mode = MouseMode.Insertion;
      this.mouseMode = MouseMode.Insertion;
    },
  },

  mounted(){
    M.AutoInit();
    mouse.mode = MouseMode.Manipulation;
  },

  components: {
    InsertButtons
  },
};