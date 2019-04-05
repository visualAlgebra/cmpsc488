import * as M from "materialize-css";
import {Deserialize} from "../expression_tree";
import {signIn, signOut} from "../user_system";
import {Mouse} from "../gui";

export default {
  name: "NavigationBar", props: ["user", "oauth"], template: `
  <div>
    <nav>
      <div class="nav-wrapper">
        <a href="http://localhost:8080/index.html" class="brand-logo">VisualAlgebra</a>
        <a href="#" class="sidenav-trigger" data-target="navbarSidenav">
          <i class="material-icons">menu</i>
        </a>
        <ul class="right hide-on-med-and-down" id="nav-mobile">
          <li>
            <a href="http://localhost:8080/index.html">Home</a>
          </li>
          <li>
            <a href="http://localhost:8080/creator.html">Create</a>
          </li>
          <li>
            <a href="http://localhost:8080/manipulator/problems/Getting_started">Manipulate</a>
          </li>
          <li>
            <a href="http://localhost:8080/explorer.html">Explore</a>
          </li>
          <li>
            <a href="http://localhost:8080/profile.html">User Profile</a>
          </li>
          <li>
            <a v-if="!logged" v-on:click="signInNow()">Login</a>
          </li>
          <li>
            <a v-if="logged" v-on:click="signOutNow()">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <ul class="sidenav" id="navbarSidenav">
      <nav>
        <div class="nav-wrapper">
          <a class="brand-logo" href="http://localhost:8080/index.html">VisualAlgebra</a>
        </div>
      </nav>
      <li>
        <a href="http://localhost:8080/index.html">Home</a>
      </li>
      <li>
        <a href="http://localhost:8080/creator.html">Create</a>
      </li>
      <li>
        <a href="http://localhost:8080/manipulator.html">Manipulate</a>
      </li>
      <li>
        <a href="http://localhost:8080/explorer.html">Explore</a>
      </li>
      <li>
        <a href="http://localhost:8080/profile.html">User Profile</a>
      </li>
      <li>
        <a href="">Login</a>
      </li>
      <li>
        <a href="">Logout</a>
      </li>      
    </ul>
  </div>  
  `,data: () => ({
    logged:false,
  }), mounted(){
    M.AutoInit();
<<<<<<< HEAD
  }
=======
  },
  methods: {
    signInNow(){
      signIn(this.oauth);
    },
    signOutNow(){
      signOut(this.displayLogoutModal);
    },displayLogoutModal(){

    }
  },
>>>>>>> 098bfc40ca00505b2238f8032f58be968e994ed9
};
