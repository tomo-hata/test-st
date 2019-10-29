/*
front: vuejs
methods.js
*/

import Api from './index'
import Api_bkend_createToken from './index'
import Api_bkend_sendToken from './index'
import Api_bkend_tokenSwap from './index'
import Api_bkend_tsClaim from './index'
import Api_bkend_getTxList from './index'
import Api_bkend_getTxList_parAcc from './index'
import Api_bkend_getTS_TradeId from './index'
import Api_bkend_getTokenList from './index'
import Api_bkend_getTS_byEOA from './index'

export default {
  testPosting(item) {
    return Api().post('/test', item)
  },
  // 他の処理も追加可能
  createTokenPosting(item) {
    return Api_bkend_createToken().post('/createToken', item)
  },
  sendTokenPosting(item) {
    return Api_bkend_sendToken().post('/sendToken', item)
  },
  tokenSwapPosting(item) {
    return Api_bkend_tokenSwap().post('/tokenSwap', item)
  },
  tsClaimPosting(item) {
    return Api_bkend_tsClaim().post('/tsClaim', item)
  },
  getTS_TradeIdPosting(item) {
    return Api_bkend_getTS_TradeId().post('/getTS_TradeId', item)
  },
  getTxListPosting(item) {
    return Api_bkend_getTxList().get('/getTxList', item)
  },
  getTxList_parAccPosting(item) {
    return Api_bkend_getTxList_parAcc().post('/getTxList_parAcc', item)
  },
  getTokenListPosting(item) {
    return Api_bkend_getTokenList().get('/getTokenList', item)
  },
  getTS_byEOAPosting(item) {
    return Api_bkend_getTS_byEOA().post('/getTS_byEOA', item)
  }
}
