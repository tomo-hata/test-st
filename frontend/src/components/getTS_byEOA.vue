<template>
  <div class="getTS_byEOA">
    
    
    <p v-show='show'>{{getUserName()}}</p>
    
    <h1>{{ msg }}</h1>
    <p>
      
      
      
      <center>
      <!--tr>
        <td>user_info：</td>
        <td><input type='text' size='50' name='userId' v-model='userId'></td>
      </tr-->
      <tr>
        <td>select：</td>
      </tr>
        <td>
          <input type='radio' size='50' name='byElse' v-model='byElse' value='bySender'>as Sender
          <input type='radio' size='50' name='byElse' v-model='byElse' value='byReceiver'>as Receiver
        </td>
      </tr>
      </center>
    </p>
    <div id="app">
      <button v-on:click="openModal" @click='post'>get</button>

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
getTS_byEOA.vue
フロント(Vue.js)
TokenSwapのTradeIdの状況確認
作成中
新規：20191025
*/

import txTable from '@/components/TxTable'
import Methods from '@/api/methods'
//import getLU from '@/script/getLoginUser'
import CommonHeader from '@/components/CommonHeader'
//20191024 add start
import { EventBus } from '@/script/EventBus'
//20191024 add end

export default {
  name: 'getTS_byEOA',
  components : {
    'txTable': txTable
  },
  data () {
    return {
      msg: 'getTS_byEOA.vue',
      initiator: 'initiator',
      counterparty: 'counterparty',
      //text: '',
      //userId: '',
      userId: '',
      //tradeId: '',
      fields: ['initiator_tradeId','initiator_sender','initiator_receiver','initiator_tokenContract','initiator_value','initiator_hashlock','initiator_timelock','initiator_status',
              'counterparty_tradeId','counterparty_sender','counterparty_receiver','counterparty_tokenContract','counterparty_value','counterparty_hashlock','counterparty_timelock','counterparty_status'],
      sendInfo: [],
      txs: [ ],
      showContent: false,
      s_flg: 0,
      username: '',
      byElse: '',
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
      
      let element = { userId: this.userId, byElse: this.byElse  }
      //let element = { userId: this.username, tradeId: this.tradeId }
      let response = await Methods.getTS_byEOAPosting(element)

      let resData = response.data.resTxList

      let getArr = [];
      
      //console.log('getArr:' + resData[0].initiator.tradeId)
      
      let getArrNum = response.data.resTxList.length;
      for(var i = 0; i<= getArrNum-1; i++) {

        console.log('getArr:' + resData[i].counterparty.tradeId)
        

        getArr.push(
          {
          //initiator
          initiator_tradeId: resData[i].initiator.tradeId,
          initiator_sender: resData[i].initiator.sender,
          initiator_receiver: resData[i].initiator.receiver,
          initiator_tokenContract: resData[i].initiator.tokenContract,
          initiator_value: resData[i].initiator.value,
          initiator_hashlock: resData[i].initiator.hashlock,
          initiator_timelock: resData[i].initiator.timelock,
          initiator_status: resData[i].initiator.status,
          //counterparty
          counterparty_tradeId: resData[i].counterparty.tradeId,
          counterparty_sender: resData[i].counterparty.sender,
          counterparty_receiver: resData[i].counterparty.receiver,
          counterparty_tokenContract: resData[i].counterparty.tokenContract,
          counterparty_value: resData[i].counterparty.value,
          counterparty_hashlock: resData[i].counterparty.hashlock,
          counterparty_timelock: resData[i].counterparty.timelock,
          counterparty_status: resData[i].counterparty.status,
          }
        )
      }
      
      console.log(...getArr)
      
      this.txs = [
        ...getArr
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
  width:75%;
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
