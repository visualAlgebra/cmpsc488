import * as M from "materialize-css";
import {Mouse, MouseMode} from "../gui";

export default {
  name: "CreatorSpecificActionButtons",

  props: {
    mouse: Mouse,
    enterPulseMode: Function,
    exitPulseMode: Function,
  },

  template: `
<div>
    <form action="#">
      <div class="row">
        <div class="col s12">
          <ul class="tabs blue-grey waves-light">
            <li id="transform" class="tab col s3 white-text active">
              <a class="white-text" @click="generalManipulation()">Transform</a>
            </li>
            <li id="merge-atoms" class="tab col s3">
              <a class="white-text" @click="mergeLiterals()">Merge Atoms</a>
            </li>
            <li id="distribute" class="tab col s3">
              <a class="white-text" @click="distribution()">Distribute</a>
            </li>
            <li id="insert" class="tab col s3">
              <a class="white-text" @click="insert()">Insert</a>
            </li>
          </ul>
        </div>
      </div>
    </form>
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
      this.mouse.mode = MouseMode.Manipulation;
      this.mouseMode = MouseMode.Manipulation;
      this.exitPulseMode();
    },
    mergeLiterals(){
      this.mouse.mode = MouseMode.MergingLiterals;
      this.mouseMode = MouseMode.MergingLiterals;
      this.exitPulseMode();
    },
    distribution(){
      this.mouse.mode = MouseMode.Distribution;
      this.mouseMode = MouseMode.Distribution;
      this.exitPulseMode();
    },
    insert(){
      this.mouse.mode = MouseMode.Insertion;
      this.mouseMode = MouseMode.Insertion;
      this.enterPulseMode();
    },
  },

  mounted(){
    M.AutoInit();
    this.mouse.mode = MouseMode.Manipulation;
  },
};