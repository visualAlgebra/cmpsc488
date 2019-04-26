import {delete_account_from_db} from "../database_management";
import {signOut} from "../user_system";

export default {
  name: "ProfilePageTop",
  props: [
    "bio",
    "time",
    "problemCount",
    "lessonCount",
    "accountID",
    "userStruct"
  ],
  template: `
  <div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title" id="userAccountIdField">
            <h1>{{accountID}}</h1>
            <button class="dropdown-trigger btn waves-effect waves-light right" data-target="dropdown">
              <i class="material-icons right">close</i>
              Delete Account
            </button>
            <ul id='dropdown' class='dropdown-content'>
              <li><a>Are you sure?</a></li>
              <li><a>No</a></li>
              <li><a v-on:click="deleteAccount">Yes</a></li>
            </ul>
            </span>
            <p>Joined on {{printableDate}}.</p>
            <p>
              Created {{lessonCount}} lesson{{pluralize(lessonCount)}} and {{problemCount}} problem{{pluralize(problemCount)}}.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>  
  `,

  methods: {
    deleteAccount(){
      delete_account_from_db(this.accountID, this.userStruct, signOut(()=>{
        alert("Account successfully deleted");
        window.document.href="http://localhost:8080/index.html";
      }));
    },
    pluralize(number) {
      return number === 1 ? '' : 's';
    },
  },

  computed: {
    printableDate() {
      const date = new Date(this.time);
      return date.toDateString();
    },
  },

  mounted(){
    M.AutoInit();
  }
};
