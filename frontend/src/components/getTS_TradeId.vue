<template>
  <div class="getTS_TradeId">
    
    
    <p v-show='show'>{{getUserName()}}</p>
    
    <h1>{{ msg }}</h1>
    <p>
      
      
      
      <center>
      <tr>
        <td>tradeId：</td>
        <td><input type='text' size='50' name='tradeId' v-model='tradeId'></td>
      </tr>
      </center>
    </p>
    <div id="app">
      <button v-on:click="openModal" @click='post'>get</button>
      <div id="overlay" v-show="showContent">
        <div id="content">
          <p v-if="s_flg===0">Waiting Result</p>
          <p v-else-if="s_flg===2">"Error !"</p>
          <p v-else-if="s_flg===1">
            <ul class="item-list-border">
              <center><h3> {{initiator }}</h3></center>
              <li><b>initiator_tradeId:</b> {{ txs[0].initiator_tradeId }} </li>
              <li><b>initiator_sender:</b> {{ txs[0].initiator_sender }} </li>
              <li><b>initiator_receiver:</b> {{ txs[0].initiator_receiver }} </li>
              <li><b>initiator_tokenContract:</b> {{ txs[0].initiator_tokenContract }} </li>
              <li><b>initiator_value:</b> {{ txs[0].initiator_value }} </li>
              <li><b>initiator_hashlock:</b> {{ txs[0].initiator_hashlock }} </li>
              <li><b>initiator_timelock:</b> {{ txs[0].initiator_timelock }} </li>
              <li><b>initiator_status:</b> {{ txs[0].initiator_status }} </li>
              <br>
              <center><h3>{{ counterparty }}</h3></center>
              <li><b>counterparty_tradeId:</b> {{ txs[0].counterparty_tradeId }} </li>
              <li><b>counterparty_sender:</b> {{ txs[0].counterparty_sender }} </li>
              <li><b>counterparty_receiver:</b> {{ txs[0].counterparty_receiver }} </li>
              <li><b>counterparty_tokenContract:</b> {{ txs[0].counterparty_tokenContract }} </li>
              <li><b>counterparty_value:</b> {{ txs[0].counterparty_value }} </li>
              <li><b>counterparty_hashlock:</b> {{ txs[0].counterparty_hashlock }} </li>
              <li><b>counterparty_timelock:</b> {{ txs[0].counterparty_timelock }} </li>
              <li><b>counterparty_status:</b> {{ txs[0].counterparty_status }} </li>
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

!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css" src="./css/general.css"></style>

<script>
/*
getTS_TradeId.vue
フロント(Vue.js)
TokenSwapのTradeIdの状況確認
修正：20191018
*/

import txTable from '@/components/TxTable'
import Methods from '@/api/methods'
//import getLU from '@/script/getLoginUser'
import CommonHeader from '@/components/CommonHeader'
//20191024 add start
import { EventBus } from '@/script/EventBus'
//20191024 add end

export default {
  name: 'getTS_TradeId',
  components : {
    'txTable': txTable
  },
  data () {
    return {
      msg: 'getTS_TradeId.vue',
      initiator: 'initiator',
      counterparty: 'counterparty',
      //text: '',
      //userId: '',
      userId: '',
      tradeId: '',
      fields: ['initiator_tradeId','initiator_sender','initiator_receiver','initiator_tokenContract','initiator_value','initiator_hashlock','initiator_timelock','initiator_status',
              'counterparty_tradeId','counterparty_sender','counterparty_receiver','counterparty_tokenContract','counterparty_value','counterparty_hashlock','counterparty_timelock','counterparty_status'],
      sendInfo: [],
      txs: [ ],
      showContent: false,
      s_flg: 0,
      username: '',
      show: '',
    }
  },

  //20191024 add start
  created () {
    EventBus.$on('setUsername', (param) => {
      console.log('setUsername:' + param)
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

      
      console.log('continue')
      
      let element = { userId: this.userId, tradeId: this.tradeId }
      let response = await Methods.getTS_TradeIdPosting(element)

      //initiator
      let initiator_tradeId = response.data.initiator_tradeId
      let initiator_sender = response.data.initiator_sender
      let initiator_receiver = response.data.initiator_receiver
      let initiator_tokenContract = response.data.initiator_tokenContract
      let initiator_value = response.data.initiator_value
      let initiator_hashlock = response.data.initiator_hashlock
      let initiator_timelock = response.data.initiator_timelock
      let initiator_status = response.data.initiator_status
      
      //counterparty
      let counterparty_tradeId = response.data.counterparty_tradeId
      let counterparty_sender = response.data.counterparty_sender
      let counterparty_receiver = response.data.counterparty_receiver
      let counterparty_tokenContract = response.data.counterparty_tokenContract
      let counterparty_value = response.data.counterparty_value
      let counterparty_hashlock = response.data.counterparty_hashlock
      let counterparty_timelock = response.data.counterparty_timelock
      let counterparty_status = response.data.counterparty_status

      this.txs = [
        {
          //initiator
          initiator_tradeId: initiator_tradeId,
          initiator_sender: initiator_sender,
          initiator_receiver: initiator_receiver,
          initiator_tokenContract: initiator_tokenContract,
          initiator_value: initiator_value,
          initiator_hashlock: initiator_hashlock,
          initiator_timelock: initiator_timelock,
          initiator_status: initiator_status,
          //counterparty
          counterparty_tradeId: counterparty_tradeId,
          counterparty_sender: counterparty_sender,
          counterparty_receiver: counterparty_receiver,
          counterparty_tokenContract: counterparty_tokenContract,
          counterparty_value: counterparty_value,
          counterparty_hashlock: counterparty_hashlock,
          counterparty_timelock: counterparty_timelock,
          counterparty_status: counterparty_status,
        },
      ]
      
      this.s_flg = 1

    }
  }
  
}
</script>
