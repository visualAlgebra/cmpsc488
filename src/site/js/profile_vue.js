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
import {getProblemFromDBVue} from "./display_feature";


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
      display: false, accountID: null, lessons: null, problems: null, bio: null, time: 0, userStruct:null, logged:false,
    };
  }, methods: {
    getAccountFromURL(){
      let argArr=(window.location.href).split('/');
      if(argArr.length>=3){
        this.accountID=argArr[5];
      }else{
        return null;
      }
      return this.problemID;
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
    },oauth_user_getter(user) {
      this.userStruct = user;
      this.logged = true;
    },
  }, created(){
    addListenerForUser(this.oauth_user_getter);
  }, mounted(){
    if(this.getAccountFromURL()!==null){
      get_account_from_db(this.accountID,this.distribute);
    }
  }, components: {
    NavigationBar, ProfilePageTop, ProblemsHolder, InvalidPage, LessonsHolder,
  },
});
