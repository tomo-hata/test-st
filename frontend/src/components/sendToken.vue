<template>
  <div class="sendToken">
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
      <tr>
        <td>to:</td>
        <td><input type='text' size='50' name='toAddr' v-model='toAddr'></td>
      </tr>
      <tr>
        <td>amount：</td>
        <td><input type='text' size='50' name='amount' v-model='amount'></td>
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
              <li><b>fromAddr:</b> {{ txs[0].fromAddr }} ( : {{ userId }} )</li>
              <li><b>toAddr:</b> {{ txs[0].toAddr }} </li>
              <li><b>contractAddr:</b> {{ txs[0].contractAddr }} ( : {{ symbol }} )</li>
              <li><b>timestamp:</b> {{ txs[0].timestamp }} </li>
              <li><b>blockNumber:</b> {{ txs[0].blockNumber }} </li>
            </ul>
          </p>
          
          <p><button v-on:click="closeModal">Close</button></p>
        </div>
      </div>
    </div>
    <br>
    <br>
    <p>
      <tx-table v-bind:items="txs" v-bind:fields="fields" />
    </p>
  </div>
</template>

!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css" src="./css/general.css"></style>

<script>
/*
sendToken.vue
フロント(Vue.js)
Tokenを送信
修正：20190830
*/

import txTable from '@/components/TxTable'
import Methods from '@/api/methods'
//20191024 add start
import { EventBus } from '@/script/EventBus'
//20191024 add end

export default {
  name: 'sendToken',
  components : {
    'txTable': txTable
  },
  //el: '#app',
  data () {
    return {
      msg: 'sendToken.vue',
      //text: '',
      userId: '',
      symbol: '',
      contractAddr: '',
      tokenId: '',
      //fromAddr: '',
      toAddr: '',
      amount: '',
      fields: ['resTxid','contractAddr','tokenId','fromAddr','toAddr','amount','blockHash','blockNumber','timestamp','status'],
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
      let element = { userId: this.userId,
        symbol: this.symbol,
        contractAddr: this.contractAddr,
        tokenId: this.tokenId,
        fromAddr: this.fromAddr,
        toAddr: this.toAddr,
        amount: this.amount
      }

      let response = await Methods.sendTokenPosting(element)
      let resTxid = response.data.resTxid
      let fromAddress = response.data.fromAddress
      let toAddress = response.data.toAddress
      let contractAddress = response.data.contractAddress
      let tokenId = response.data.tokenId
      let sendAmount = response.data.sendAmount
      //let balance = response.data.balance
      let blockhash = response.data.blockHash
      let blokNum = response.data.blockNumber
      let timestamp = response.data.timestamp
      let status = response.data.status

      this.txs = [
        {
          resTxid: resTxid,
          fromAddr: fromAddress,
          toAddr: toAddress,
          contractAddr: contractAddress,
          tokenId: tokenId,
          amount: sendAmount,
          blockHash: blockhash,
          blockNumber: blokNum,
          timestamp: timestamp,
          status: status
        },
      ]
      
      this.s_flg = 1

    }
  }
  
}
</script>
