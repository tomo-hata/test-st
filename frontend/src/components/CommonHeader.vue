<template>
  <header id="header">
    
    <p>login: <b> {{ getUsername() }} </b></p>
    
    <div>
      <!--HOMEに戻る-->
      <router-link to="/" class="badge badge-primary">Go to Home</router-link>
      
      <!--ログアウトコンポーネント-->
      <amplify-sign-out class="signout"></amplify-sign-out>
    
    </div>
    
    <h1>{{ msg }}</h1>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="signedIn">
            <amplify-sign-out></amplify-sign-out>
          </li>
        </ul>
      </div>
    
    
  </header>
  

  
  
</template>

<script>

import Vue from 'vue'
import { AmplifyEventBus } from "aws-amplify-vue";
//20191024 add start
import { EventBus } from '@/script/EventBus'
//20191024 add end

export default {
  name: 'CommonHader',
  data() {
    return {
      msg: 'BC-Demo',
      signedIn: false,
      username: ''
    };
  },
  
  methods: {
    getUsername: function() {
      this.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
        //this.signedIn = true;
        this.username = data.username
        //console.log('ttt: ' + this.username)
        //return this.username;
      });
      
      console.log('t4: ' + this.username)
      return this.username
  
    }
  
  },
  
  async beforeCreate() {
    try {
      await this.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
        this.signedIn = true;
      });
    } catch (err) {
      this.signedIn = false;
    }
    AmplifyEventBus.$on("authState", info => {
      this.signedIn = info === "signedIn";
      this.username = info === "username";
    });
  },

  computed: {
    getRouteInfo () {
      return `${this.$route.name} : ${this.$route.path}`
    }
  },
  //20191024 add start
  created()  {
    EventBus.$on('getUsername', () => {
      EventBus.$emit('setUsername', this.username)
    });
  }
  //20191024 add start
  
}
</script>


<style>
.signout {
  margin: 10;
}
</style>