/*
backend_getTxList_parAcc
フロント(Vue.js)から呼び出される
DynamoDBからアカウント（EOA）をキーに検索・一覧を取得、フロントにも結果を返す
修正：20190807
*/

const web3 = require('web3');
const express = require('express');
var router = express.Router();
const fs = require("fs");

var request = require('request');
var https = require("https");

const bodyParser = require('body-parser')
// corsポリシーに抵触するため、その対策としてcorsを利用する
const cors = require('cors');

router.post('/',function(req,res){

  console.log("fromAddr: " +req.body.fromAddr);

  var fromAddress = req.body.fromAddr;

  //dynamodb: txinfo:data-push
  const path = require("path");
  var aws = require('aws-sdk');
  aws.config.loadFromPath(path.join(__dirname, "../../manage_offchain/dynamo_mng/config_ddb.json"));
  
  const docClient = new aws.DynamoDB.DocumentClient();
  // テーブルのデータ検索
  var params = {
      TableName: 'db_TxInfo',
      IndexName: 'fromAddress-index',
      ExpressionAttributeNames:{'#id':'fromAddress'},
      ExpressionAttributeValues:{':values': fromAddress},
      KeyConditionExpression: '#id = :values'
  };
  // table operation: all data get
  docClient.query(params, function (err, data) {
  console.log(params);
  console.log(data);
    if (err) {
      console.log(err, err.stack);
    } else {
      
      data.Items.forEach(function(person, index){
         console.log(person);
     });
      console.log(data.Items[0]);

      // return front with some data
      res.send({
        resTxList: data.Items

      })
        
    }
  });
  
});

module.exports = router;
