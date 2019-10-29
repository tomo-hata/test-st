<template>
  <div class="tokenSwap">
    
    <h1>{{ msg }}</h1>
    <p>
      <center>
      <tr>
        <td>user_info：</td>
        <td><input readonly type='text' size='50' name='userId' v-model='userId'></td>
        <td v-show='show'>{{getUserName()}}</td>
      </tr>
      <tr>
        <td>tokenSymbol：</td>
        <td><input type='text' size='50' name='symbol' v-model='symbol'></td>
      </tr>
      <tr>
        <td>contract：</td>
        <td><input type='text' size='50' name='contractAddr' v-model='contractAddr'></td>
      </tr>
      <tr>
        <td>tokenId：</td>
        <td><input type='text' size='50' name='tokenId' v-model='tokenId'></td>
      </tr>
      <!--tr>
        <td>from：</td>
        <td><input type='text' size='50' name='fromAddr' v-model='fromAddr'></td>
      </tr-->
      <tr>
        <td>to:</td>
        <td><input type='text' size='50' name='toAddr' v-model='toAddr'></td>
      </tr>
      <tr>
        <td>amount：</td>
        <td><input type='text' size='50' name='amount' v-model='amount'></td>
      </tr>
      <tr>
        <td>hash-lock：</td>
        <td><input type='text' size='50' name='hashlock' v-model='hashlock'></td>
      </tr>
      </center>
    </p>
    <div id="app">
      <button v-on:click="openModal" @click='post'>post</button>
      <div id="overlay" v-show="showContent">
        <div id="content">
          <p v-if="s_flg===0">Waiting Result</p>
          <p v-else-if="s_flg===1">
            <ul class="item-list-border">
              <li><b>secret:</b> {{ txs[0].secret }} </li>
              <li><b>hash-lock:</b> {{ txs[0].hashlock }} </li>
              <li><b>tradeId:</b> {{ txs[0].tradeId }} </li>
              <li><b>fromAddr:</b> {{ txs[0].fromAddr }}  ( : {{ userId }} )</li>
              <li><b>toAddr:</b> {{ txs[0].toAddr }} </li>
              <li><b>contractAddr:</b> {{ txs[0].tokenAddress }}  ( : {{ symbol }} )</li>
              <li><b>contractName:</b> {{ txs[0].tokenName }} </li>
              <li><b>contractSymbol:</b> {{ txs[0].tokenSymbol }} </li>
              <li><b>amount:</b> {{ txs[0].amount }} </li>
              <li><b>timelock:</b> {{ txs[0].timelock }} </li>
            </ul>
          
          </p>
          <p><button v-on:click="closeModal">Close</button></p>
        </div>
      </div>
    </div>
    <br>
    <br>
    <div>
      <router-link to="/tsClaim" class="badge badge-primary">Go to Claime for withdraw</router-link>
    </div>
    <br>
    <p>
      <tx-table v-bind:items="txs" v-bind:fields="fields" />
    </p>
  </div>
</template>

<script>
/*
tokenSwap.vue
フロント(Vue.js)
Token同士をswap(DvP)
修正：20190830
*/

import txTable from '@/components/TxTable'
import Methods from '@/api/methods'
//20191024 add start
import { EventBus } from '@/script/EventBus'
//20191024 add end

export default {
  name: 'tokenSwap',
  components : {
    'txTable': txTable
  },
  data () {
    return {
      msg: 'tokenSwap.vue',
      //text: '',
      userId: '',
      symbol: '',
      contractAddr: '',
      tokenId: '',
      fromAddr: '',
      toAddr: '',
      amount: '',
      hashlock: '',
      fields: ['secret','fromAddr','toAddr','tokenName','tokenSymbol','tokenAddress','amount','hashlock','tradeId','timelock','environmentId'],
      //fields: ['testres'],
      sendInfo: [],
      txs: [ ],
      showContent: false,
      s_flg: 0,
      show: '',
    }
  },

  //20191024 add start
  created () {
    EventBus.$on('setUsername', (param) => {
      //console.log('setUsername:' + param)
      this.setUserName(param)
    })
  },
  //20191024 add end
  
  methods: {
    
    openModal: function(){
      this.showContent = true
      if (this.s_flg == 1){
        this.s_flg = 0
      }
    },
    closeModal: function(){
      this.showContent = false
    },

    //20191024 add start
    getUserName: function() {
      //CommonHeaderへ通信
      EventBus.$emit('getUsername');
      return this.userId
    },
    setUserName: function (value) {
      //CommonHeaderから戻ってきた値をusernameにセット
      this.userId = value
    },
    //20191024 add end
    
    async post() {
      //let element = { text: this.text }
      let element = {
        userId: this.userId,
        symbol: this.symbol,
        contractAddr: this.contractAddr,
        tokenId: this.tokenId,
        fromAddr: this.fromAddr,
        toAddr: this.toAddr,
        amount: this.amount,
        hashlock: this.hashlock
      }
      let response = await Methods.tokenSwapPosting(element)
      let secret = response.data.secret
      let hashlock = response.data.hashlock
      let tradeId = response.data.tradeId
      let tokenName = response.data.tokenName
      let tokenSymbol= response.data.tokenSymbol
      let tokenAddress = response.data.tokenAddress
      let fromAddress = response.data.senderAddress
      let amount = response.data.amount
      let timelock = response.data.timelock
      let environmentId = response.data.environmentId

      console.log("output: " + response.data.secret)

      this.txs = [
        {
          secret: secret,
          fromAddr: fromAddress,
          toAddr: this.toAddr,
          tokenName: tokenName,
          tokenAddress: tokenAddress,
          tokenSymbol: tokenSymbol,
          amount: amount,
          hashlock: hashlock,
          tradeId: tradeId,
          timelock: timelock,
          environmentId: environmentId
          
          
        },
      ]

      this.s_flg = 1

    }
  }
  
}
</script>

!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#overlay{
  /*　要素を重ねた時の順番　*/
  z-index:1;

  /*　画面全体を覆う設定　*/
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  /*　画面の中央に要素を表示させる設定　*/
  display: flex;
  align-items: center;
  justify-content: center;

}

#content{
  z-index:2;
  width:60%;
  padding: 1em;
  background:#fff;
}

.item-list-is-border {
  list-style: none;
  padding: 0;
  
  border: solid 1px #bbb;
  margin-bottom: 20px;
}
 
li {
  border-top: solid 1px #bbb;
  margin-top: -1px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
 
}

</style>
