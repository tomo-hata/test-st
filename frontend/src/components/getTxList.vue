<template>
  <div class="getTxList">
    <h2>{{ msg }}</h2>
    <button @click='post'>get</button>
    <br>
    <br>
    <p>
      <tx-table v-bind:items="txs" v-bind:fields="fields" />
    </p>
    
  </div>
</template>
<script>
import txTable from '@/components/TxTable'
import Methods from '@/api/methods'


export default {
  name: 'getTxList',
  components : {
    'txTable': txTable
  },
  data () {
    return {
      msg: 'getTxList.vue',
      fields: ['resTxid','contractAddr','tokenId','fromAddr','toAddr','amount','blockHash','blockNumber','timestamp','status'],
      txs: [ ]
    }
  },
  methods: {
    /*
    backend_getTxList
    フロント(Vue.js)
    バックエンド（nodejs）経由でDynamoDBから一覧を取得、結果を受け取る
    修正：20190817
    */
    async post() {
      
      //let response = await Methods.getTxListPosting().then(x => {this.txs = x.data.resTxList} )
      let response = await Methods.getTxListPosting()
      
      let resTxListData = response.data.resTxList;
      
      let getArr = [];
      let getArrNum = response.data.resTxList.length;
      for(var i = 0; i<= getArrNum-1; i++) {
        getArr.push(
          {
            resTxid: resTxListData[i].Txhash,
            contractAddr: resTxListData[i].ContractAddress,
            tokenId: resTxListData[i].tokenId,
            fromAddr: resTxListData[i].fromAddress,
            toAddr: resTxListData[i].toAddress,
            amount: resTxListData[i].sendAmount,
            blockHash: resTxListData[i].Blockhash,
            blockNumber: resTxListData[i].BlockNum,
            timestamp: resTxListData[i].Timestamp,
            status: resTxListData[i].Status
          }
        )
      }

      this.txs = [
        ...getArr
      ]      
      
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
</style>
