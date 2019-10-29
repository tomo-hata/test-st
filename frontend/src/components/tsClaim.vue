<template>
  <div class="tsClaim">
    
    <h1>{{ msg }}</h1>
    <p>
      <center>
      <tr>
        <td>user_info：</td>
        <td><input readonly type='text' size='50' name='userId' v-model='userId'></td>
        <td v-show='show'>{{getUserName()}}</td>
      </tr>
      <!--tr>
        <td>from：</td>
        <td><input type='text' size='50' name='fromAddr' v-model='fromAddr'></td>
      </tr-->
      <tr>
        <td>tradeId：</td>
        <td><input type='text' size='50' name='tradeId' v-model='tradeId'></td>
      </tr>
      <tr>
        <td>secret：</td>
        <td><input type='text' size='50' name='secret' v-model='secret'></td>
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
              <li><b>Txid:</b> {{ txs[0].resTxid }} </li>
              <li><b>succress:</b> {{ txs[0].success }} </li>
              <li><b>tradeId:</b> {{ txs[0].tradeId }} </li>
              <li><b>fromAddr:</b> {{ txs[0].fromAddr }}  ( : {{ userId }} )</li>
            </ul>
          </p>
          <p><button v-on:click="closeModal">Close</button></p>
        </div>
      </div>
    </div>
    <br>
    <br>
    <div>
      <router-link to="/tokenSwap" class="badge badge-primary">Go to Token Swap</router-link>
    </div>
    <br>
    <p>
      <tx-table v-bind:items="txs" v-bind:fields="fields" />
    </p>
  </div>
</template>

<script>
/*
tsClaim.vue
フロント(Vue.js)
TokenSwapに相手がdepositしたトークンを引き出す(DvP)
修正：20190830
*/

import txTable from '@/components/TxTable'
import Methods from '@/api/methods'
//20191024 add start
import { EventBus } from '@/script/EventBus'
//20191024 add end

export default {
  name: 'tsClaim',
  components : {
    'txTable': txTable
  },
  data () {
    return {
      msg: 'tsClaim.vue',
      //text: '',
      userId: '',
      //fromAddr: '',
      tradeId: '',
      secret: '',
      fields: ['resTxid','tradeId','contractAddr','fromAddr','toAddr','amount','success'],
      //fields: ['testres'],
      sendInfo: [],
      txs: [ ],
      showContent: false,
      s_flg: 0
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
      let element = { userId: this.userId, tradeId: this.tradeId, secret: this.secret }
      let response = await Methods.tsClaimPosting(element)
      //let response = await Methods.testPosting(element)
      //console.log(response.data.message)
      //let resTxid = response.data.resTxid
      //let fromAddress = response.data.fromAddress
      //let toAddress = response.data.toAddress
      //let contractAddress = response.data.contractAddress
      //let sendAmount = response.data.sendAmount
      //let balance = response.data.balance
      //let blockhash = response.data.blockHash
      //let blokNum = response.data.blockNumber
      //let timestamp = response.data.timestamp
      //let status = response.data.status
      let resTxid = response.data.resTxid
      let success = response.data.success

      //this.sendInfo = [ {response.data.contractAddress,response.data.fromAddress,response.data.toAddress,response.data.sendAmount} ]
      //this.sendInfo = [ {contractAddress,fromAddress,toAddress,sendAmount,balance,resTxid} ]
      //console.log("output: " + this.sendInfo)

      this.txs = [
        {
          //resTxid: resTxid,
          //fromAddr: fromAddress,
          //toAddr: toAddress,
          //contractAddr: contractAddress,
          //amount: sendAmount,
          //blockHash: blockhash,
          //blockNumber: blokNum,
          //timestamp: timestamp,
          //status: status
          resTxid: resTxid,
          success: success,
          tradeId: this.tradeId,
          fromAddr: this.fromAddr
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
