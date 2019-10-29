/*
front: vuejs
src/router
index.js
*/

import Vue from 'vue'
import Router from 'vue-router'
import sendToken from '@/components/sendToken'
import tokenSwap from '@/components/tokenSwap'
import tsClaim from '@/components/tsClaim'
import TxList from '@/components/TxList'
import getTxList from '@/components/getTxList'
import getTxList_parAcc from '@/components/getTxList_parAcc'
import getTS_TradeId from '@/components/getTS_TradeId'

//20191016 add start
import getTokenList from '@/components/getTokenList'
import createToken from '@/components/createToken'
//20191016 add end

//20191025 add start
import getTS_byEOA from '@/components/getTS_byEOA'
//20191025 add end


//20191015 add start
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import store from '@/store'
import { components, AmplifyEventBus } from 'aws-amplify-vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
//20191015 add end

Vue.use(Router)

// 20191015 add start
Vue.use(AmplifyPlugin, AmplifyModules)

let user;
// ユーザー管理
getUser().then((user) => {
    if (user) {
        //router.push({path: '/'});
        this.$router.push({path: '/'});
    }
});

function getUser() {
    return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
        if (data && data.signInUserSession) {
            store.commit('setUser', data);
            return data;
        }
    }).catch(() => {
        store.commit('setUser', null);
        return null;
    });
}

// ログイン状態管理
AmplifyEventBus.$on('authState', async (state) => {
    if (state === 'signedOut'){
        user = null;
        store.commit('setUser', null);
        router.push({path: '/login'});
    } else if (state === 'signedIn') {
        user = await getUser();
        router.push({path: '/'});
        //this.$router.push({path: '/'});
    }
});
// 20191015 add end

const router = new Router({
  // 20191015 add
  mode: 'history',
  
  routes: [
    
    // 20191015 add start
    {
      // ログインページ
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      // トップページ
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true}
    },
    // 20191015 add end
    
    {
      path: '/sendToken',
      name: 'sendToken',
      component: sendToken,
      meta: { requiresAuth: true}
    },
    {
      path: '/tokenSwap',
      name: 'tokenSwap',
      component: tokenSwap,
      meta: { requiresAuth: true}
    },
    {
      path: '/tsClaim',
      name: 'tsClaim',
      component: tsClaim,
      meta: { requiresAuth: true}
    },
    {
      path: '/getTS_TradeId',
      name: 'getTS_TradeId',
      component: getTS_TradeId,
      meta: { requiresAuth: true}
    },
    {
      path: '/txlist',
      name: 'TxList',
      component: TxList,
      meta: {
        title: 'tx list',
        requiresAuth: true
      }
    },
    {
      path: '/getTxList',
      name: 'getTxList',
      component: getTxList,
      meta: { requiresAuth: true}
    },
    {
      path: '/getTxList_parAcc',
      name: 'getTxList_parAcc',
      component: getTxList_parAcc,
      meta: { requiresAuth: true}
    },
    // 20191016 add start
    {
      path: '/getTokenList',
      name: 'getTokenList',
      component: getTokenList,
      meta: { requiresAuth: true}
    },
    {
      path: '/createToken',
      name: 'createToken',
      component: createToken,
      meta: { requiresAuth: true}
    },
    // 20191016 add end
    
    // 20191025 add start
    {
      path: '/getTS_byEOA',
      name: 'getTS_byEOA',
      component: getTS_byEOA,
      meta: { requiresAuth: true}
    }
    // 20191025 add end
  ]
})


// 20191015 add start
// リダイレクト設定
router.beforeResolve(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        user = await getUser();
        if (!user) {
            return next({
                path: '/login'
            });
        }
        return next()
    }
    return next()
});
// 20191015 add end

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
})


export default router