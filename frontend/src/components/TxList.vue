<template>
  <div class="txlist">
    <h1>{{ title }}</h1>
    <tx-table v-bind:items="txs" v-bind:fields="fields" />
  </div>
</template>

<script>
import txTable from '@/components/TxTable'

export default {
  name: 'TxList',
  components : {
    'txTable': txTable
  },
  data () {
    return {
      title: 'Tx List',
      fields: ['contractAddr','fromAddr','toAddr','amount','blockhash','resTxid'],
      txs: [ ]
    }
  },
  created: function() {
    let contractAddress = "0x12xxx";
    let fromAddress = "0x222";
    let toAddress = "0x333";
    let sendAmount = 1;
    let blockhash = "0x444";
    let txhash = "0x555";
    
    

    this.txs = [
      {contractAddr: contractAddress, fromAddr: fromAddress, toAddr: toAddress, amount: sendAmount,blockhash: blockhash, resTxid: txhash},
       {contractAddr: contractAddress, fromAddr: fromAddress, toAddr: toAddress, amount: sendAmount,blockhash: blockhash, resTxid: txhash},
    ]
  }
}
</script>