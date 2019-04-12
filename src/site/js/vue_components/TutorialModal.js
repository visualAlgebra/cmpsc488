import { determineProblem } from "../tutorial/tutorial";


export default {
  name: "TutorialModal",template: `
  <div id="tutModal" class="modal black-text">
    <ul class="pagination">
      <li class="waves-effect"><a href="#!" v-on:click="setTut(1)">1</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(2)">2</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(3)">3</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(4)">4</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(5)">5</a></li>
    </ul>
    <div class="modal-content">
      <h4>Tutorial</h4>
      <img src="http://localhost:8080/src/site/assets/com_swap_160.gif">
      <p id="tutText" ></p>
    </div>
    <div class="modal-footer">
      <a class="waves-effect waves-green btn-flat" v-on:click="back()">Back</a>
      <a class="waves-effect waves-green btn-flat" v-on:click="next()">Next</a>
    </div>
  </div>
  `, data() {
    return {
      index: null, tutMessages: null, tutNum: null
    };
  }, mounted() {
    this.setTut(1);
  },
  methods: {
    next(){
      if(this.index < this.tutMessages.length) this.index++;
      this.setText();
    }, back() {
      if (this.index > 0) this.index--;
      this.setText();
    }, setTut(i) {
      this.tutNum = i;
      this.index = 0;
      this.tutMessages = determineProblem(this.tutNum)
      this.setText();
    }, setText() {
      $("#tutText").text(this.tutMessages[this.index]);
    }, changeImg() {
      
    }
  }
}