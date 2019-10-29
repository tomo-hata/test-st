/*
backend_getTokenList
フロント(Vue.js)から呼び出される
DynamoDBから一覧を取得、フロントにも結果を返す
新規：20191016
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


router.get('/',function(req,res){

  //dynamodb: txinfo:data-push
  const path = require("path");
  var aws = require('aws-sdk');
  
  aws.config.loadFromPath(path.join(__dirname, "../../manage_offchain/dynamo_mng/config_ddb.json"));

  
  const docClient = new aws.DynamoDB.DocumentClient();
  //var dynamodb = new aws.DynamoDB();
  // テーブルのデータ取得
  var params = {
      TableName: 'db_TokenList',
      Select: "ALL_ATTRIBUTES"
  };
  // table operation: all data get
  docClient.scan(params, function (err, data) {
  //dynamodb.scan(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data.Items);
        // return front with some data
        res.send({
          resTokenList: data.Items
        })
          
      }
  });
  
});
//app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = router;
