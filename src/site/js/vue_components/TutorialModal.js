import { determineProblem } from "../tutorial/tutorial";


export default {
  name: "TutorialModal",template: `
  <div id="tutModal" class="modal black-text">
    <div class="modal-content">
      <h4>Tutorial</h4>        
      <p id="tutText" ></p>
    </div>
    <div class="modal-footer">
      <a class="waves-effect waves-green btn-flat" v-on:click="back()">Back</a>
      <a class="waves-effect waves-green btn-flat" v-on:click="next()">Next</a>
    </div>
  </div>
  `, data() {
    return {
      index: 0, tutMessages: null
    };
  }, mounted() {
    this.tutMessages = determineProblem(1);
    $("#tutText").text(this.tutMessages[this.index]);
  },
  methods: {
    next(){
      console.log(this.index);
      if(this.index < this.tutMessages.length) this.index++;
      $("#tutText").text(this.tutMessages[this.index])
    }, back() {
      console.log(this.index);
      if (this.index > 0) this.index--;
      $("#tutText").text(this.tutMessages[this.index])
    }
  }
}