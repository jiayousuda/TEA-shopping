var app = getApp()
var wxParse = require("../../wxParse/wxParse.js")
Page({
  data: {
    info: {},
    userInfo: {},
    size:['1','2','3','4','5'],
    imgwidth2: 0,
    imgheight2: 0,
    screenHeight: 0,
    screenWidth: 0
  },
  onShareAppMessage: function (res) {
    app.shareApp(res)
  },
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    }); 
    app.ajax(app.ceport.mendian_category, { rd_session: wx.getStorageSync('rd_session'),}, function (res) {
      that.setData({
        info: res.data.list
      })
    });
  },
  callphone(e){
    let num = e.currentTarget.dataset.num
    wx.makePhoneCall({
      phoneNumber: num
    })
  },
  tolist(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/pl/plist?id='+id+"&name="+name,
    })
  },
  imageLoad2: function (e) {
    var that = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例 
    var viewWidth = that.data.screenWidth,           //设置图片显示宽度，  
      viewHeight = $width / ratio;    //计算的高度值   
    this.setData({
      imgwidth2: viewWidth,
      imgheight2: viewHeight
    })
    console.log(that.data.imgwidth2)
    console.log(that.data.imgheight2)
  },
  phone1: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: "17782833823"
    })
  }
});