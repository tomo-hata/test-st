/*
backend:nodejs
index.js
修正： 20191016
*/

var express = require('express');
// ルーティングするで
var router = express.Router();

// routerにルーティングの動作を書いてく
router.get('/',function(req,res){
    res.json({
        message:"Hello,world...111"
    });
});

//apiに応じて振り分け
router.use('/sendToken', require('./backend_sendToken.js'));
router.use('/tokenSwap', require('./backend_tokenSwap.js'));
router.use('/tsClaim', require('./backend_tsClaim.js'));
router.use('/getTS_TradeId', require('./backend_getTS_TradeId.js'));
router.use('/getTxList', require('./backend_getTxList.js'));
router.use('/getTxList_parAcc', require('./backend_getTxList_parAcc.js'));

// 20191016 add start
router.use('/getTokenList', require('./backend_getTokenList.js'));
router.use('/createToken', require('./backend_createToken.js'));
// 20191016 add end

// 20191025 add start
router.use('/getTS_byEOA', require('./backend_getTS_byEOA.js'));
// 20191025 add end

//routerをモジュールとして扱う準備
module.exports = router;