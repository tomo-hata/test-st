/*
backend_getTS_TradeId
フロント(Vue.js)から呼び出される
TokenSwapのTradeIdをキーにkaleidoのAPIを叩き、フロントに結果を返す
修正：20190902
*/

const web3 = require('web3');
const express = require('express');
var router = express.Router();
//const Tx = require('ethereumjs-tx');
const Tx = require('ethereumjs-tx').Transaction;
const fs = require("fs");

var request = require('request');
var https = require("https");

const bodyParser = require('body-parser')
// corsポリシーに抵触するため、その対策としてcorsを利用する
const cors = require('cors');

//20191021 add start

var from_userid;
var from_password;
var api_host_tkswap;
var api_host_tkfactory
//20191021 add end

router.post('/',function(req,res){

  var userId = req.body.userId;
  var tradeId = req.body.tradeId;

  console.log("userId: " + userId);
  console.log("tradeId: " + tradeId);

  //20191019 add start
  let element = { userId: userId };
  var Gen_getKConn = require('./gen_getKaleidoConn');

  // kaleidoへの接続情報を取得
  Gen_getKConn.gen(element).then(function(result) {
    console.log('t1t1: '  + result)
    
    //20191020 add start

    from_userid = result.z_kaleido_userid
    from_password = result.z_kaleido_password
    api_host_tkswap = result.z_kaleido_host_tkSwap
    api_host_tkfactory = result.z_kaleido_host_tkFactory
    //20191020 add end
    
    
    //実行本体を呼び出す
    getTS_TradeId(result);
    
  });
  //20191019 add end
  
  // 実行本体
  function getTS_TradeId(result) {
    

    //POST: byTradeId(using kaleido API)
    var options = { 
      host: api_host_tkswap,
      path: '/api/v1' +  '/swaps/byTradeId' + '/' + tradeId,
      method: 'GET',
      headers:
       { accept: 'application/json',
        'Authorization': 'Basic ' + new Buffer.from(from_userid + ':' + from_password).toString('base64'),
         'Content-Type': 'application/json',
       },

      json: true };
  
    let inner_req = https.request(options, (inner_res) => {

      let body ='';
      inner_res.setEncoding('utf8');
  
      inner_res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        let txdata = JSON.parse(chunk);
  
        require('date-utils');
        let now = new Date();
        let timestamp = now.toFormat('YYYY/MM/DD/ HH24:MI:SS');
        
        let counterparty_tradeId = ''
        let counterparty_sender = ''
        let counterparty_receiver = ''
        let counterparty_tokenContract = ''
        let counterparty_value = ''
        let counterparty_hashlock = ''
        let counterparty_timelock = ''
        let counterparty_status = ''
        
        if (txdata.counterparty != null) {
          counterparty_tradeId = txdata.counterparty.tradeId
          counterparty_sender = txdata.counterparty.sender
          counterparty_receiver = txdata.counterparty.receiver
          counterparty_tokenContract = txdata.counterparty.tokenContract
          counterparty_value = txdata.counterparty.value
          counterparty_hashlock = txdata.counterparty.hashlock
          counterparty_timelock = txdata.counterparty.timelock
          counterparty_status = txdata.counterparty.status      
        }
  
        
        res.send({
          initiator_tradeId: txdata.initiator.tradeId,
          initiator_sender: txdata.initiator.sender,
          initiator_receiver: txdata.initiator.receiver,
          initiator_tokenContract: txdata.initiator.tokenContract,
          initiator_value: txdata.initiator.value,
          initiator_hashlock: txdata.initiator.hashlock,
          initiator_timelock: txdata.initiator.timelock,
          initiator_status: txdata.initiator.status,
          counterparty_tradeId: counterparty_tradeId,
          counterparty_sender: counterparty_sender,
          counterparty_receiver: counterparty_receiver,
          counterparty_tokenContract: counterparty_tokenContract,
          counterparty_value: counterparty_value,
          counterparty_hashlock: counterparty_hashlock,
          counterparty_timelock: counterparty_timelock,
          counterparty_status: counterparty_status,
          
        })
  
        
      });
    });
    inner_req.on('error', (e) => {
      console.log('problem with request: ' + e.message);
    });

    inner_req.end();
  
  }
  
});

module.exports = router;
