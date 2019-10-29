/*
backend_getTS_byEOA
フロント(Vue.js)から呼び出される
TokenSwap:EOAをキーにkaleidoのAPIを叩き、フロントに結果を返す
作成中
新規：20191025
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
var search_eoa

var from_userid;
var from_password;
var api_host_tkswap;
var api_host_tkfactory
//20191021 add end

router.post('/',function(req,res){

  var userId = req.body.userId;

  console.log("userId: " + userId);

  //20191019 add start
  let element = { userId: userId };
  var Gen_getKConn = require('./gen_getKaleidoConn');

  // kaleidoへの接続情報を取得
  Gen_getKConn.gen(element).then(function(result) {
    console.log('t1t1: '  + result)
    
    //20191020 add start
    search_eoa = result.eoa

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
      path: '/api/v1' +  '/swaps/byReceiver' + '/' + search_eoa,
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
        console.log(chunk.length)
        console.log('BODY: ' + chunk);
        let txdata = JSON.parse(chunk);
        //let txdata = chunk.Items
        
        //console.log('test:' + txdata[1].initiator.tradeId)
        console.log('test:' + txdata.length)
        console.log('test:' + JSON.stringify(txdata[0]))
  

  
        
        res.send({
          resTxList: txdata
          
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
