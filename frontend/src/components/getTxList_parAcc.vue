<template>
  <div class="getTxList_parAcc">
    <h1>{{ msg }}</h1>
    
    <p>
      <center>
      <tr>
        <td>User_Address：</td>
        <td><input type='text' size='50' name='fromAddr' v-model='fromAddr'></td>
      </tr>
      </center>
    </p>
    
    
    <button @click='post'>get</button>
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
import txTable from '@/components/TxTable'
import Methods from '@/api/methods'


export default {
  name: 'getTxList_parAcc',
  components : {
    'txTable': txTable
  },
  data () {
    return {
      msg: 'getTxList_parAcc.vue',
      fromAddr: '',
      fields: ['resTxid','contractAddr','tokenId','fromAddr','toAddr','amount','blockHash','blockNumber','timestamp','status'],
      sendInfo: [],
      txs: [ ]
    }
  },
  methods: {
    async post() {
      let element = { fromAddr: this.fromAddr }
      
      console.log(element);
      
      let response = await Methods.getTxList_parAccPosting(element)
      
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
