/*
backend: nodejs
app.js
*/

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// corsポリシーに抵触するため、その対策としてcorsを利用する
//cors: 異なるドメイン間でデータ共有する際に許可なく連携することを禁止する規約
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

var port = process.env.PORT || 3000;
var router = require('./routes/v1/');
app.use('/', router);

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);