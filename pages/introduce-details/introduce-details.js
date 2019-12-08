//index.js
//获取应用实例
const app = getApp()
var wxParse = require("../../wxParse/wxParse.js")

Page({
  data: {
    movies: [
    ],
    info: [],
    news: [],
    contact: [],
    bann:[]

  },
  onLoad: function () {
    var that = this
    app.ajax(app.ceport.index, {}, function (res) {
      //渲染其他数据
      that.setData({
        info: res.data,
        movies: res.data.ad_list,
        news: res.data.news,
        config: res.data.config,
        bann: res.data.about_ad_list
      })
      wxParse.wxParse("about", "html", res.data.about.content, that)
    });
  },
  // 公司简介详情
  intro: function () {
    wx: wx.navigateTo({
      url: "/pages/introduce-details/introduce-details",
    })
  },
  // 公司新闻动态
  dynamic: function () {
    wx: wx.navigateTo({
      url: "/pages/dynamic-details/dynamic-details",
    })
  },
  // 位置
  // 要给第二个页面传公司位置经纬度
  map: function (e) {
    var long = e.currentTarget.dataset.long;
    var lat = e.currentTarget.dataset.lat;
    wx: wx.navigateTo({
      url: "/pages/maps/maps?long=" + long + "&lat=" + lat,
    })
  },
  detail: function (e) {
    var idd = e.currentTarget.dataset.id;
    wx: wx.navigateTo({
      url: "/pages/news/news?idd=" + idd,
    })
  }
})
