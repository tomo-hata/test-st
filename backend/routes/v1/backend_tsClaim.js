/*
backend_tokenSwap_Claim
フロント(Vue.js)から呼び出される
ERC20トークン同士の交換をatomicなDvPで行い、結果をDynamoDBに格納、フロントにも結果を返す
修正：20190805
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

  console.log("userid: " + req.body.userId);
  console.log("tradeId: " + req.body.tradeId);
  console.log("secret: " + req.body.secret);

  var userId = req.body.userId;
  var tradeId = req.body.tradeId;
  var secret = req.body.secret;
  
  //20191019 add start
  let element = { userId: userId };

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


    //実行本体を呼び出す
    tsClaim(result);
    
    
  });
  //20191019 add end

  // 実行本体
  function tsClaim(result) {

    //POST: transfer(using kaleido API)
    let rawData = {
      'secret': secret,
      'from': fromAddress
    };
    
    let rawDataStr = JSON.stringify(rawData);
    console.log('rowDataStr: ' + rawDataStr);
    
    
    var options = { 
      host: api_host_tkswap,
      path: '/api/v1' +  '/trades' + '/' + tradeId + '/withdraw',
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
      let body ='';
      inner_res.setEncoding('utf8');
  
      inner_res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        let txdata = JSON.parse(chunk);
  
        
        require('date-utils');
        let now = new Date();
        let timestamp = now.toFormat('YYYY/MM/DD/ HH24:MI:SS');
      
        res.send({
          resTxid: txdata.result.transactionHash,
          success: txdata.result.success
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
