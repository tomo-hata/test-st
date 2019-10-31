/*
backend_createToken
フロント(Vue.js)から呼び出される
トークンを組成し、結果をDynamoDBに格納、フロントにも結果を返す
新規：20190816
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
  let _id = req.body._id;
  let tokenName = req.body.tokenName;
  let symbol = req.body.symbol;
  let decimals = req.body.decimals;
  let tokenType = req.body.type;
  let supply = req.body.supply;
  let burnable = req.body.burnable;
  let mintable = req.body.mintable;
  let deploy = req.body.deploy;

  //modifying_20190818
  //list_token
  const list_token_path = '../../manage_offchain/list_token';
  const list_token_file = 'list_token_config.json';
  let json_list_token = require(list_token_path + '/' + list_token_file, 'utf8');
  
  let contractAddress;
  
  console.log("userid: " + userId);
  console.log("_id: " +_id);
  console.log("tokenName: " +tokenName);
  console.log("tokenType: " +tokenType);
  console.log("decimals: " +decimals);
  console.log("supply: " +supply);
  console.log("burnable: " +burnable);
  console.log("mintable: " + mintable);
  console.log("deploy:" +deploy);
  
  
  //20191019 add start
  let element = { userId: userId };
  var Gen_getKConn = require('./gen_getKaleidoConn');

  // kaleidoへの接続情報を取得
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
    createToken(result);
    
  });
  //20191019 add end
  
  function createToken(result) {
    
    //POST: createToken(using kaleido API)
    
    let deploy_ck;
    if (deploy == 'true') {
      deploy_ck = 'true';
    } else {
      deploy_ck = '';
    }
    
    let rawData;
    
    if ( _id == '') {
      
      rawData = {
         'name': tokenName,
         'symbol': symbol,
         'type': tokenType,
         'decimals': decimals,
         'from': fromAddress,
         'supply': supply,
         'burnable': burnable,
         'mintable': mintable,
         'deploy': deploy_ck
      };
    }
    else {
      rawData = {
          '_id': _id,
         'name': tokenName,
         'symbol': symbol,
         'type': tokenType,
         'decimals': decimals,
         'from': fromAddress,
         'supply': supply,
         'burnable': burnable,
         'mintable': mintable,
         'deploy': deploy_ck
      };   
    }
    
    let rawDataStr = JSON.stringify(rawData);
    console.log('rowDataStr: ' + rawDataStr);
    
    var options = { 
      //host: `{environment_id}-{service_id}-tokenfactory.us0-aws.kaleido.io`,
      host: api_host_tkfactory,
      path: '/api/v1/contracts',
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
        
        console.log(txdata)
  
        
        require('date-utils');
        let now = new Date();
        let timestamp = now.toFormat('YYYY/MM/DD/ HH24:MI:SS');
        
        // 値が空の場合の処理(20190816 add)
        if (supply == '') {
          supply = ' ';
        } else {
          supply = txdata.result.supply
        }
        console.log('supply is' + supply);
        let tokenId;
        tokenId = '-';
        //if (tokenId == '') {
        //  tokenId = ' ';
        //}
        //  console.log('tokenId is ' + tokenId);
        let ContractAddress;
        ContractAddress = txdata.result.address
        if (ContractAddress == '') {
          ContractAddress = '-';
        } else {
          ContractAddress = ContractAddress;
        }
  
        //deployフラグをtrue以外はfalseに再変換
        if (deploy_ck == '') {
          deploy = 'false';
        }
        
        // 空文字対応
        let BurnTotal = '0';
        let MintTotal = '0';
        
        //dynamodb: txinfo:data-push
        const path = require("path");
        var aws = require('aws-sdk');
        aws.config.loadFromPath(path.join(__dirname, "../../manage_offchain/dynamo_mng/config_ddb.json"));
  
        var dynamodb = new aws.DynamoDB();
        // テーブルにデータ追加
        var params = {
            TableName: 'db_TokenList',
            Item: {
                'ContractName': {"S": txdata.result.name},
                'Owner': {"S": txdata.result.from},
                'symbol': {"S": txdata.result.symbol},
                'Type': {"S": txdata.result.type},
                'ContractAddress': {"S": ContractAddress},
                'decimals': {"S": txdata.result.decimals},
                '_id': {"S": txdata.result._id},
                'tokenId': {"S": tokenId},
                //'sendAmount': {"S": (parseInt(txdata.result.logs[0].data,16)).toString()},
                'InitialSupply': {"S": supply},
                'TotalSupply': {"S": supply},
                'TS_Initialize': {"S": timestamp.toString()},
                'Burnable': {"S": txdata.result.burnable},
                'Burn_Total': {"S": BurnTotal},
                'Mintable': {"S": txdata.result.mintable},
                'Mint_Total': {"S": MintTotal},
                'deploy': {"S": deploy}
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
          tokenName: txdata.result.name,
          fromAddress: txdata.result.from,
          symbol: txdata.result.symbol,
          tokenType: txdata.result.type,
          contractAddress: ContractAddress,
          decimals: txdata.result.decimals,
          _id: txdata.result._id,
          tokenId: tokenId,
          InitialSupply: supply,
          TotalSupply: supply,
          TS_Initialize: timestamp.toString(),
          burnable: txdata.result.burnable,
          mintable: txdata.result.mintable,
          deploy: deploy
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
