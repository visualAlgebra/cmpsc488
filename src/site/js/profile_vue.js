import Vue from "vue";
import NavigationBar from "./vue_components/NavigationBar";
import ProfilePageTop from "./vue_components/ProfilePageTop";
import {get_account_from_db} from "./database_management";
import {LessonInfo, ProblemInfo} from "./expression_tree";
import {account_to_load, fillPage} from "./profile";
import ProblemsHolder from "./vue_components/ProblemsHolder";
import InvalidPage from "./vue_components/InvalidPage";
import LessonsHolder from "./vue_components/LessonsHolder";
import {addListenerForUser} from "./user_system";


export const profile_vue=new Vue({
  name: "Root", el: "#vue-app", template: `
  <div>
    <NavigationBar v-bind:user="userStruct" v-bind:oauth="oauth_user_getter" v-bind:logged="logged"></NavigationBar>
    <InvalidPage v-if="!display"></InvalidPage>
    <ProfilePageTop v-if="display"
    v-bind:bio="bio"
    v-bind:time="time"
    v-bind:problemCount="problems.length"
    v-bind:accountID="accountID">
    </ProfilePageTop>
    <LessonsHolder v-if="display" v-bind:lessons="lessons"></LessonsHolder>
    <div class="divider"></div>
    <ProblemsHolder v-if="display" v-bind:problems="problems"></ProblemsHolder>
  </div>
  `, data(){
    return {
      display: false, accountID:null, lessons: null, problems: null, bio: null, time: 0, userStruct:null, logged:false, gotAccount:false,
    };
  }, methods: {
    getAccountFromURL(){
      let argArr=(window.location.href).split('/');
      if(argArr.length==6){
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
      }
      this.lessons=les;
      this.problems=prob;
      this.display=true;
    },oauth_user_getter(user){
      this.userStruct = user;
      this.logged = true;
      if(this.gotAccount===false) {
        get_account_from_db(this.userStruct.accountID, this.distribute);
        this.accountID=this.userStruct.accountID;
        this.gotAccount = true;
      }
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
    NavigationBar, ProfilePageTop, ProblemsHolder, InvalidPage, LessonsHolder,
  },
});
