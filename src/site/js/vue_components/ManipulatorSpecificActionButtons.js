import * as M from "materialize-css";
import {Mouse, MouseMode} from "../gui";

export default {
  name: "ManipulatorSpecificActionButtons",

  props: {
    mouse: Mouse,
  },

  template: `
  <div>
    <section>
      <form action="#">
        <div class="row">
          <div class="col s12">
            <ul class="tabs blue-grey waves-light">
              <li id="1" class="tab col s3 white-text active">
                <a class="white-text" v-on:click="generalManipulation()">General Manipulation</a>
              </li>
              <li id="2" class="tab col s3">
                <a class="white-text" v-on:click="mergeLiterals()">Merging Literals</a>
              </li>
              <li id="3" class="tab col s3">
                <a class="white-text" v-on:click="distribution()">Distribution</a>
              </li>
              <li id="4" class="tab col s3">
                <a class="white-text" v-on:click="insert()">Insert</a>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </section>
    <section id="manipulatorsSubPanel" style="display:none">
      <div class="card-panel">
        <div class="row">
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            East-West
          </button>
        </div>
        <div class="row">
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            North-South
          </button>
        </div>
        <div class="row">
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            0
          </button>
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            1
          </button>
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            2
          </button>
        </div>
        <div class="row">
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            x1
          </button>
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            x2
          </button>
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            x3
          </button>
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            x4
          </button>
          <button class="btn waves-effect waves-light">
            <i class="material-icons left">add</i>
            x5
          </button>
        </div>  
      </div>
    </section>
  </div>  
  `, methods: {
    generalManipulation(){
      this.changeMouseMode(0);
    }, mergeLiterals(){
      this.changeMouseMode(1);
    }, distribution(){
      this.changeMouseMode(2);
    }, insert(){
      this.mouse.mode = MouseMode.Insertion;
      this.insertMenu(true);
    }, changeMouseMode(num){
      this.insertMenu(false);
      if(num===0){
        this.mouse.mode = MouseMode.Manipulation;
      }else if(num===1){
        this.mouse.mode = MouseMode.MergingLiterals;
      }else if(num===2){
        this.mouse.mode = MouseMode.Distribution;
      }
    }, insertMenu(type){
      if(type){
        document.getElementById("manipulatorsSubPanel").style.display="inline";
      }else{
        document.getElementById("manipulatorsSubPanel").style.display="none";
      }
    },
  }, mounted(){
    M.AutoInit();
    this.changeMouseMode(0);
  }
};