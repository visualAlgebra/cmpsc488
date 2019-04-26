import { determineProblem, getImg } from "../tutorial/tutorial";
import $ from "jquery"

export default {
  name: "TutorialModal",template: `
  <div id="tutModal" class="modal black-text">
    <ul class="pagination">
      <li class="waves-effect"><a href="#!" v-on:click="setTut(1)">1</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(2)">2</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(3)">3</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(4)">4</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(5)">5</a></li>
      <li class="waves-effect"><a href="#!" v-on:click="setTut(6)">6</a></li>
    </ul>
    <div class="modal-content">
      <h4 id="tutTitle" >Tutorial</h4>
      <img id="tutImg" src="http://localhost:8080/src/site/assets/com_swap_160.gif">
      <p id="tutText" ></p>
      <a id="tutProbLink" href=""></a>
    </div>
    <div class="modal-footer">
      <a class="waves-effect waves-green btn-flat" v-on:click="back()">Back</a>
      <a class="waves-effect waves-green btn-flat" v-on:click="next()">Next</a>
    </div>
  </div>
  `, data() {
    return {
      index: null, tutMessages: null, tutNum: null, tutImgs: null
    };
  }, mounted() {
    this.setTut(1);
  },
  methods: {
    next(){
      if(this.index < this.tutMessages.length-1) {
        this.index++;
        this.setText();
        this.changeImg();
      }
    }, back() {
      if (this.index > 0){
        this.index--;
        this.setText();
        this.changeImg();
      } 
    }, setTut(i) {
      this.tutNum = i;
      this.index = 0;
      this.tutMessages = determineProblem(this.tutNum);
      this.tutImgs = getImg(this.tutNum);
      this.setText();
      this.changeImg();
    }, setText() {
      $("#tutText").text(this.tutMessages[this.index]);
      $("#tutProbLink").text("Tutorial Problem " + this.tutNum);
      // $("#tutProbLink").attr("href", "https://visualalgebra.org/manipulator/problems/tp" + this.tutNum);
      $("#tutProbLink").attr("href", "http://localhost:8080/algebra/problems/tp" + this.tutNum);      
    }, changeImg() {

      document.getElementById("tutImg").setAttribute("src", this.tutImgs[this.index]);
    }
  }
}