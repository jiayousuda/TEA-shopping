const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    movies:[],
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    imgwidth2: 0,
    imgheight2: 0,
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
    
    app.ajax(app.ceport.index, {}, function (res) {
      //渲染其他数据
      that.setData({
        jiameng: res.data.jiameng
      })
      WxParse.wxParse('article', 'html', res.data.jiameng.content, that, 5);//商品介绍
    });
  },
  imageLoad: function (e) {
    var that = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例 
      var viewWidth = that.data.screenWidth,           //设置图片显示宽度，  
      viewHeight = viewWidth / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
    console.log(that.data.imgwidth)
    console.log(that.data.imgheight)
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
  },
})