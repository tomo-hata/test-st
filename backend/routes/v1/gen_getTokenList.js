/*
gen_getTokenList.js
バックエンド(nodejs)から呼び出される
引数として渡されたtokennameをキーにDynamoDBよりkaleido APIコネクトに必要な設定値を抽出し、結果を返す
新規：20191019
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


exports.gen = function(req){
  
  return new Promise(function(resolve) {
  
    //console.log("userId: " + req.userId);
    var symbol;
    symbol = req.symbol;
  
  
    //dynamodb: 
    const path = require("path");
    var aws = require('aws-sdk');
    aws.config.loadFromPath(path.join(__dirname, "../../manage_offchain/dynamo_mng/config_ddb.json"));
    //aws.config.loadFromPath(path.join(__dirname, "./config.json"));
    
    const docClient = new aws.DynamoDB.DocumentClient();
    //var dynamodb = new aws.DynamoDB();
    // テーブルのデータ検索
    var params = {
        TableName: 'db_TokenList',
        IndexName: 'symbol-index',
        ExpressionAttributeNames:{'#id':'symbol'},
        //ExpressionAttributeValues:{':values': {"S" :userId}},
        ExpressionAttributeValues:{':values': symbol},
        KeyConditionExpression: '#id = :values'
    };
    // パラメータを基に検索
    docClient.query(params, function (err, data) {
    console.log(params);
    //console.log(data);
      if (err) {
        console.log(err, err.stack);
      } else {
        
        data.Items.forEach(function(token, index){
           //console.log(token);
       });
        console.log(data.Items[0]);

      }
      
      resolve(data.Items[0]);
      
    });

    //setTimeout(function() {
    //  console.log('test20191020: ')
      //resolve(data);
    //}, 1000);

  });

};


