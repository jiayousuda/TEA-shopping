var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    userInfo: {},
    size: ['1', '2', '3', '4', '5']
  },
  onLoad: function (options) {
  var that=this
  app.ajax(app.ceport.about_jifen, { rd_session: wx.getStorageSync('rd_session')}, function (res) {
      WxParse.wxParse('about', 'html', res.data.data.info.content, that, 5);
    });
  },
  
})