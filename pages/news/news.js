const app = getApp()
var wxParse = require("../../wxParse/wxParse.js")
Page({
  data: {
  
  },
  onLoad: function (options) {
    var idd = options.idd
    var that = this
    app.ajax(app.ceport.content_detail, { rd_session: app.globalData.userInfo.rd_session, content_id: options.idd}, function (res) {
      //渲染其他数据
      that.setData({
        info: res.data.data,
      })
      wxParse.wxParse("about", "html", res.data.data.content, that)
    });
  },
  phone1: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: "17782833823"
    })
  },
})