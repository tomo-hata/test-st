/*
backend_tokenSwap
フロント(Vue.js)から呼び出される
ERC20トークン同士の交換をatomicなDvPで行い、結果をDynamoDBに格納、フロントにも結果を返す
修正：20190816
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
var fromAddress
var contractAddress

var from_userid;
var from_password;
var api_host_tkswap;
var api_host_tkfactory
//20191021 add end

router.post('/',function(req,res){
  
  let userId = req.body.userId;
  let fromAddress = req.body.fromAddr;
  let toAddress = req.body.toAddr;
  let symbol = req.body.symbol;
  //let contractAddress = req.body.contractAddr;
  let tokenId = req.body.tokenId;
  let sendAmount = req.body.amount;
  let hashlock = req.body.hashlock;
  
  console.log("userid: " + userId);
  console.log("fromAddr: " +fromAddress);
  console.log("toAddr: " +toAddress);
  console.log("symbol: " +symbol);
  console.log("contractAddr: " +contractAddress);
  console.log("tokenId: " +tokenId);
  console.log("amount: " +sendAmount);
  console.log("hash-lock" + hashlock);

  //20191019 add start
  let element = { userId: userId, symbol: symbol };

  // dynamodbよりkaleidoへの接続情報を取得  
  var Gen_getKConn = require('./gen_getKaleidoConn');
  Gen_getKConn.gen(element).then(function(result) {
    console.log('t1t1: '  + result)

    //20191020 add start
    fromAddress = result.eoa

    from_userid = result.z_kaleido_userid
    from_password = result.z_kaleido_password
    api_host_tkswap = result.z_kaleido_host_tkSwap
    api_host_tkfactory = result.z_kaleido_host_tkFactory
    //20191020 add end

  })
  
  // dynamodbよりsymbolを検索キーにしてコントラクトアドレスを取得 
  var Gen_getTokenList = require('./gen_getTokenList');
  Gen_getTokenList.gen(element).then(function(result) {
    
    console.log('t1t2: '  + result.ContractName)
    
    //20191020 add start
    contractAddress = result.ContractAddress
    //20191020 add end
    

    //実行本体を呼び出す
    tokenSwap(result);
    
    
  });
  //20191019 add end

  // 実行本体
  function tokenSwap(result) {  

    //POST: transfer(using kaleido API)
    let rawData = {
      'token-address': contractAddress,
      'from': fromAddress,
      'to': toAddress,
      'amount': sendAmount,
      'token-id': tokenId,
      'hash-lock': hashlock
  
    };
    
    let rawDataStr = JSON.stringify(rawData);
    console.log('rowDataStr: ' + rawDataStr);
    
    
    var options = { 
      host: api_host_tkswap,
      path: '/api/v1' +  '/trades',
      method: 'POST',
      headers:
       { accept: 'application/json',
        'Authorization': 'Basic ' + new Buffer.from(from_userid + ':' + from_password).toString('base64'),
         'Content-Type': 'application/json',
         'Content-Length': rawDataStr.length,
       },
      body: rawDataStr,
      json: true };
  
  
    let inner_req = https.request(options, (inner_res) => {
      //console.log('STATUS: ' + inner_res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(inner_res.headers));
      let body ='';
      inner_res.setEncoding('utf8');
  
      inner_res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        let txdata = JSON.parse(chunk);
  
        
        require('date-utils');
        let now = new Date();
        let timestamp = now.toFormat('YYYY/MM/DD/ HH24:MI:SS');
        
        res.send({
          secret: txdata.result.secret,
          hashlock: txdata.result['hash-lock'],
          tradeId: txdata.result['trade-id'],
          tokenName: txdata.result.emailOptions.tokenName,
          tokenSymbol: txdata.result.emailOptions.tokenSymbol,
          tokenAddress: txdata.result.emailOptions.tokenAddress,
          senderAddress: txdata.result.emailOptions.senderAddress,
          amount: txdata.result.emailOptions.value,
          timelock: txdata.result.emailOptions.timelock,
          environmentId: txdata.result.emailOptions.environmentId,
          
        })
  
        
      });
    });
    inner_req.on('error', (e) => {
      console.log('problem with request: ' + e.message);
    });
    inner_req.write(rawDataStr);
    inner_req.end();
  
  }
  

});

module.exports = router;
