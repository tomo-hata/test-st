<template>
  <div class="getTokenList">
    <h2>{{ msg }}</h2>
    <button @click='post'>get</button>
    <br>
    <br>
    <p>
      <token-table v-bind:items="tokens" v-bind:fields="fields" />
    </p>
    
  </div>
</template>

!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css" src="./css/general.css"></style>

<script>
import tokenTable from '@/components/TokenTable'
import Methods from '@/api/methods'


export default {
  name: 'getTokenList',
  components : {
    'tokenTable': tokenTable
  },
  data () {
    return {
      msg: 'getTokenList.vue',
      fields: ['contractAddr','tokenName','tokenId','OwnerAddr','totalSupply','tokenType','TS_Initialize','mintTotal','mintable','burnTotal','burnable','deploy'],
      tokens: [ ]
    }
  },
  methods: {
    /*
    backend_getTokenList
    フロント(Vue.js)
    バックエンド（nodejs）経由でDynamoDBから一覧を取得、結果を受け取る
    新規：20191016
    */
    async post() {
      
      //let response = await Methods.getTxListPosting().then(x => {this.txs = x.data.resTxList} )
      let response = await Methods.getTokenListPosting()
      
      let resTokenListData = response.data.resTokenList;

      let getArr = [];
      let getArrNum = response.data.resTokenList.length;
      for(var i = 0; i<= getArrNum-1; i++) {
        getArr.push(
          {
            contractAddr: resTokenListData[i].ContractAddress,
            tokenName: resTokenListData[i].ContractName,
            tokenId: resTokenListData[i].tokenId,
            OwnerAddr: resTokenListData[i].Owner,
            totalSupply: resTokenListData[i].TotalSupply,
            tokenType: resTokenListData[i].Type,
            TS_Initialize: resTokenListData[i].TS_Initialize,
            mintTotal: resTokenListData[i].Mint_Total,
            mintable: resTokenListData[i].Mintable,
            burnTotal: resTokenListData[i].Burn_Total,
            burnable: resTokenListData[i].Burnable,
            deploy: resTokenListData[i].deploy
            
          }
        )
      }

      this.tokens = [
        ...getArr
      ]      
      
    }
  }
  
}
</script>
