/*
getLoginUser.js
汎用スクリプト（JS）
amplifyでログイン中のusername(useridとする)を取得
注）現状、更新（グルグル回るやつ）直後だけ、何故かundefinedとなる。
修正：20191018
*/

import Vue from 'vue';
//import { AmplifyEventBus } from "aws-amplify-vue";

//import BootstrapVue from 'bootstrap-vue'
//import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
//import awsconfig from '@/aws-exports'
//Amplify.configure(awsconfig)

//Vue.use(BootstrapVue, AmplifyPlugin, AmplifyModules)

export default {

    data () {
        return {
           //username: '' 
        }
    },

    getLoginUser() {
      
      //let username;

      try {
      
        Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
          
          this.signedIn = true;
          this.username = data.username
          //console.log('t1: ' + this.username)
          //return this.username
        });

      } catch (err) {
        this.signedIn = false;
        this.username = ''
        console.log('t2: ' + this.username)
      }
      
      console.log('t3: ' + this.username)
      return this.username
    
    }
    
}   
    
    





