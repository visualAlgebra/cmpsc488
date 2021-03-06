import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import ProfilePageTop from "./vue_components/ProfilePageTop";
import {delete_lesson_from_db, delete_problem_from_db, get_account_from_db} from "./database_management";
import {Deserialize, LessonInfo, ProblemInfo} from "./expression_tree";
import {account_to_load, fillPage} from "./profile";
import ProblemsHolder from "./vue_components/ProblemsHolder";
import InvalidPage from "./vue_components/InvalidPage";
import LessonsHolder from "./vue_components/LessonsHolder";
import {addListenerForUser} from "./user_system";
import LessonEditModal from "./vue_components/LessonEditModal";
import Footer from "./vue_components/Footer";
import {singleExpressionDecompression} from "./display_feature";


export const profile_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth_user_getter="oauth_user_getter" v-bind:oauth_user_remover="oauth_user_remover" v-bind:logged="logged"></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <div class="container">
      <ProfilePageTop v-if="display"
      v-bind:bio="bio"
      v-bind:time="time"
      v-bind:problemCount="problems.length"
      v-bind:lessonCount="lessons.length"
      v-bind:accountID="accountID"
      v-bind:userStruct="userStruct">
      </ProfilePageTop>
      <button v-if="userStruct&&userStruct.accountID===accountID&&display" class="modal-trigger btn waves-effect waves-light" data-target="lessonEditModal">
        <i class="material-icons right">add</i>
        Create new lesson
      </button>
      <LessonsHolder v-if="display" v-bind:lessons="lessons" v-bind:deleteLesson="deleteLesson" v-bind:userStruct="userStruct" v-bind:accountID="accountID"></LessonsHolder>
      <ProblemsHolder v-if="display&&problems&&amtConfirmed===0" v-bind:problems="problems" v-bind:deleteProblem="deleteProblem" v-bind:userStruct="userStruct" v-bind:accountID="accountID"></ProblemsHolder>
      <LessonEditModal v-if="userStruct&&userStruct.token" v-bind:userStruct="userStruct"></LessonEditModal>
    </div>
    <Footer/>
  </div>
  `, data(){
    return {
      display: false, accountID:null, lessons: null, problems: null, bio: null, time: 0, userStruct:null, logged:false, gotAccount:false, amtConfirmed:0
    };
  }, methods: {
    getAccountFromURL(){
      let argArr=(window.location.href).split('/');
      if(argArr.length===6){
        return argArr[5];
      }else{
        return null;
      }
    }, distribute(res){
      this.bio=res.bio;
      this.time=res.timeCreated;
      let les=[];
      for(let x in res.lessons){
        x=parseInt(x);
        let k=res.lessons[x];
        les[x]=new LessonInfo(k.lessonID, k.creations, k.timeCreated, k.creatorAccountID, k.description);
      }
      let prob=[];
      for(let x in res.problems){
        x=parseInt(x);
        let k=res.problems[x];
        prob[x]=new ProblemInfo(k.problemID, k.startExpression, k.goalExpression, k.description, k.timeCreated);
        this.amtConfirmed+=2;
      }
      this.lessons=les;
      for(let x=0; x<prob.length; x++){
        singleExpressionDecompression(prob[x].expression_goal, res => {
          prob[x].expression_goal = Deserialize(res);
          this.amtConfirmed--;
        });
        singleExpressionDecompression(prob[x].expression_start, res => {
          prob[x].expression_start = Deserialize(res);
          this.amtConfirmed--;
        });
      }
      this.problems=prob;
      this.display=true;
    }, oauth_user_getter(user){
      this.userStruct = user;
      this.logged = true;
      if(this.gotAccount===false) {
        get_account_from_db(this.userStruct.accountID, this.distribute);
        this.accountID=this.userStruct.accountID;
        this.gotAccount = true;
      }
    }, oauth_user_remover(){
      this.usersStruct=null;
      this.logged=false;
      if(this.gotAccount){
        this.gotAccount=false;
        this.display=false;
        this.lessons=null;
        this.problems=null;
        this.bio=null;
        this.time=0;
      }
    }, deleteProblem(problemID){
      this.problems=this.problems.filter(function(value){
        return value.problemID!==problemID;
      });
      delete_problem_from_db(problemID, this.userStruct, this.successfulDeletionProb);
    }, deleteLesson(lessonID){
      this.lessons=this.lessons.filter(function(value){
       return value.lessonID!==lessonID;
      });
      delete_lesson_from_db(lessonID, this.userStruct, this.successfulDeletionLesson);
    }, successfulDeletionProb(){
      alert("Problem Deleted Successfully");
    }, successfulDeletionLesson(){
      alert("Lesson Deleted Successfully");
    }
  }, mounted(){
    let accountID=this.getAccountFromURL();
    if(accountID!==null&&this.gotAccount===false){
      get_account_from_db(accountID,this.distribute);
      this.accountID=accountID;
      this.gotAccount=true;
    }
  }, created(){
    addListenerForUser(this.oauth_user_getter);
  }, components: {
    NavigationBar, ProfilePageTop, ProblemsHolder, InvalidPage, LessonsHolder, LessonEditModal, Footer,
  },
});
