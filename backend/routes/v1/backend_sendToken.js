/*
backend_sendToken
フロント(Vue.js)から呼び出される
ERC20トークンを送金し、結果をDynamoDBに格納、フロントにも結果を返す
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
  let toAddress = req.body.toAddr;
  let symbol = req.body.symbol;
  let tokenId = req.body.tokenId;
  let sendAmount = req.body.amount;

  console.log("userid: " + userId);
  //console.log("fromAddr: " +fromAddress);
  console.log("toAddr: " +toAddress);
  console.log("symbol: " +symbol);
  console.log("tokenId: " +tokenId);
  console.log("amount: " +sendAmount);

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
    
    //20191020 add start
    contractAddress = result.ContractAddress
    //20191020 add end
    

    //実行本体を呼び出す
    sendToken(result);
    
    
  });
  //20191019 add end
  
  // 実行本体
  function sendToken(result) {  
  
    //POST: transfer(using kaleido API)
    let rawData = {
       'toAddress': toAddress,
       'amount': sendAmount,
       'tokenId': tokenId,
       'from': fromAddress
    };
    
    let rawDataStr = JSON.stringify(rawData);
    console.log('rowDataStr: ' + rawDataStr);
    
    
    var options = { 
      host: api_host_tkfactory,
      path: '/api/v1/contracts/' + contractAddress + '/transfer',
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
      console.log('STATUS: ' + inner_res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(inner_res.headers));
      let body ='';
      inner_res.setEncoding('utf8');
  
      inner_res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        let txdata = JSON.parse(chunk);
  
        
        require('date-utils');
        let now = new Date();
        let timestamp = now.toFormat('YYYY/MM/DD/ HH24:MI:SS');
        
        // 値が空の場合の処理(20190816 add)
        if (sendAmount == '') {
          sendAmount = ' ';
        } else {
          sendAmount = (parseInt(txdata.result.logs[0].data,16)).toString();
        }
        console.log('sendAmount is' + sendAmount);
        if (tokenId == '') {
          tokenId = ' ';
          console.log('tokenId is ' + tokenId);
        }
        
        //dynamodb: txinfo:data-push
        const path = require("path");
        var aws = require('aws-sdk');
        aws.config.loadFromPath(path.join(__dirname, "../../manage_offchain/dynamo_mng/config_ddb.json"));
  
        var dynamodb = new aws.DynamoDB();
        // テーブルにデータ追加
        var params = {
            TableName: 'db_TxInfo',
            Item: {
                'Txhash': {"S": txdata.result.transactionHash},
                'fromAddress': {"S": txdata.result.from},
                'toAddress': {"S": toAddress},
                'ContractAddress': {"S": txdata.result.to},
                'tokenId': {"S": tokenId},
                //'sendAmount': {"S": (parseInt(txdata.result.logs[0].data,16)).toString()},
                'sendAmount': {"S": sendAmount},
                'BlockNum': {"S": (txdata.result.blockNumber).toString()},
                'Blockhash': {"S": txdata.result.blockHash},
                'Timestamp': {"S": timestamp.toString()},
                'Status': {"BOOL": txdata.result.status},
                
            }
        };
        // table operation
        dynamodb.putItem(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(data.fromAddress);
            }
        });
        
        res.send({
          resTxid: txdata.result.transactionHash,
          fromAddress: txdata.result.from,
          toAddress: toAddress,
          contractAddress: txdata.result.to,
          tokenId: tokenId,
          sendAmount: sendAmount,
          blockNumber: (txdata.result.blockNumber).toString(),
          blockHash: txdata.result.blockHash,
          timestamp: timestamp.toString(),
          status: txdata.result.status
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
