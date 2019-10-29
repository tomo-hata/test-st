<template>
  <div class="createToken">
    <h1>{{ msg }}</h1>
    <p>
      <center>
      <tr>
        <td>user_info：</td>
        <td><input readonly type='text' size='50' name='userId' v-model='userId'></td>
        <td v-show='show'>{{getUserName()}}</td>
      </tr>
      <tr>
        <td>tokenid：</td>
        <td><input type='text' size='50' name='tokenId' v-model='tokenId'></td>
      </tr>
      <tr>
        <td>tokenName：</td>
        <td><input type='text' size='50' name='tokenName' v-model='tokenName'></td>
      </tr>
      <tr>
        <td>symbol：</td>
        <td><input type='text' size='50' name='symbol' v-model='symbol'></td>
      </tr>
      <tr>
        <td>type(20/721)：</td>
        <td><input type='text' size='50' name='type' v-model='type'></td>
      </tr>
      <tr>
        <td>decimals：</td>
        <td><input type='text' size='50' name='decimals' v-model='decimals'></td>
      </tr>
      <!--tr>
        <td>Owner：</td>
        <td><input type='text' size='50' name='fromAddr' v-model='fromAddr'></td>
      </tr-->
      <tr>
        <td>supply：</td>
        <td><input type='text' size='50' name='supply' v-model='supply'></td>
      </tr>
      <tr>
        <td>burnable：</td>
        <td><input type='text' size='50' name='burnable' v-model='burnable'></td>
      </tr>
      <tr>
        <td>mintable：</td>
        <td><input type='text' size='50' name='mintable' v-model='mintable'></td>
      </tr>
      <tr>
        <td>deploy：</td>
        <td><input type='text' size='50' name='deploy' v-model='deploy'></td>
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
              <li><b>tokenName:</b> {{ txs[0].tokenName }} </li>
              <li><b>symbol:</b> {{ txs[0].symbol }} </li>
              <li><b>contractAddr:</b> {{ txs[0].contractAddr }} </li>
              <li><b>decimals:</b> {{ txs[0].decimals }} </li>
              <li><b>_id:</b> {{ txs[0]._id }} </li>
              <li><b>Owner:</b> {{ txs[0].fromAddr }} </li>
              <li><b>TotalSupply:</b> {{ txs[0].TotalSupply }} </li>
              <li><b>TokenType:</b> {{ txs[0].tokenType }} </li>
              <li><b>timestamp:</b> {{ txs[0].TS_Initialize }} </li>
              <li><b>burnable:</b> {{ txs[0].burnable }} </li>
              <li><b>mintable:</b> {{ txs[0].mintable }} </li>
              <li><b>deploy:</b> {{ txs[0].deploy }} </li>
            </ul>
          </p>
          
          <p><button v-on:click="closeModal">Close</button></p>
        </div>
      </div>
    </div>
    <br>
    <br>
    <p>
      <token-table v-bind:items="txs" v-bind:fields="fields" />
    </p>
  </div>
</template>

!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css" src="./css/general.css"></style>

<script>
/*
createToken.vue
フロント(Vue.js)
Tokenを組成
新規：20191016
*/

import tokenTable from '@/components/TokenTable'
import Methods from '@/api/methods'
import getLoginUser from '@/script/getLoginUser.js'
//20191024 add start
import { EventBus } from '@/script/EventBus'
//20191024 add end

export default {
  name: 'createToken',
  components : {
    'tokenTable': tokenTable
  },
  //el: '#app',
  data () {
    return {
      msg: 'createToken.vue',
      //text: '',
      userId: '',
      tokenId: '',
      tokenName: '',
      symbol: '',
      decimals: '0',
      type: 'erc20',
      supply: '',
      burnable: 'true',
      mintable: 'true',
      deploy: 'true',
      fields: ['contractAddr','tokenName','_id','fromAddr','TotalSupply','tokenType','TS_Initialize','mintTotal','mintable','burnTotal','burnable','decimals','deploy'],
      //fields: ['testres'],
      sendInfo: [],
      txs: [ ],
      showContent: false,
      s_flg: 0,
      show: false,
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
        _id: this.tokenId,
        tokenName: this.tokenName,
        symbol: this.symbol,
        type: this.type,
        decimals:  this.decimals,
        supply: this.supply,
        burnable: this.burnable,
        mintable: this.mintable,
        deploy: this.deploy
      }

      let response = await Methods.createTokenPosting(element)
      //let response = await Methods.testPosting(element)
      //console.log(response.data.message)
      let contractName = response.data.tokenName
      let symbol = response.data.symbol
      let fromAddress = response.data.fromAddress
      let contractAddress = response.data.contractAddress
      let decimals = response.data.decimals
      let _id = response.data._id
      let tokenType = response.data.tokenType
      let supply = response.data.InitialSupply
      //let balance = response.data.balance
      let timestamp = response.data.TS_Initialize
      let mintable = response.data.mintable
      let burnable = response.data.burnable
      let deploy = response.data.deploy

      this.txs = [
        {
          tokenName: contractName,
          symbol: symbol,
          fromAddr: fromAddress,
          contractAddr: contractAddress,
          decimals: decimals,
          _id: _id,
          tokenType: tokenType,
          TotalSupply: supply,
          TS_Initialize: timestamp,
          burnable: burnable,
          mintable: mintable,
          deploy: deploy
        },
      ]
      
      this.s_flg = 1

    }
  }
  
}
</script>
