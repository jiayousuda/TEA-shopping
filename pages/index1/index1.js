//index.js
//获取应用实例
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    movies:[
    ],
    info:[], 
    news:[],
    contact:[],
    phone:'',
    imgwidth: 0,
    imgheight: 0,
    imgwidth1: 0,
    imgheight1: 0,
    imgwidth2: 0,
    imgheight2: 0,
    imgwidth3: 0,
    imgheight3: 0,
    screenHeight:0,
    screenWidth:0,
  },
  onLoad: function () {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });  
    wx.getExtConfig({
      success: function (res) {
        wx.setStorageSync('appkey', res.extConfig.appkey);
        app.ajax(app.ceport.index, {}, function (res) {
          //渲染其他数据
          that.setData({
            about: res.data.about.description,
            info: res.data,
            movies: res.data.ad_list,
            // news: res.data.news,
            config: res.data.config,//联系
            phone: res.data.config.phone,//电话
            remai: res.data.remai,//热卖
            xinpin: res.data.xinpin,//新品
            pinpai: res.data.pinpai,
            video: res.data.config.video,
            latitude: res.data.config.latitude,
            longitude: res.data.config.longitude
          })
          WxParse.wxParse('article', 'html', res.data.pinpai.content, that, 5);//商品介绍
        });
        // 折扣
        app.ajax(app.ceport.coupons, { pagesize: 6 }, function (res) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.list
          });
        });
        // 分栏
        app.ajax(app.ceport.category_list, {}, function (res) {
          that.setData({
            category_list: res.data.list
          });
        });

      }
    })
  },
  // 领取优惠券
  gitCoupon: function (e) {
    var that = this;
    // 获取优惠券
    app.ajax(app.ceport.fetch, {
      coupon_id: e.currentTarget.dataset.id,
      rd_session: wx.getStorageSync("rd_session")
    }, function (res) {
      wx.showToast({
        title: '领取成功',
      })
    });
  },
//  图片的宽高
  imageLoad: function (e) {
    var that = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例 
    var viewWidth = $width,           //设置图片显示宽度，  
      viewHeight = $width/ ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  }  ,
  imageLoad1: function (e) {
    var that = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例 
    var viewWidth = $width,           //设置图片显示宽度，  
      viewHeight = $width / ratio;    //计算的高度值     
    this.setData({
      imgwidth1: viewWidth,
      imgheight1: viewHeight
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
  },
  imageLoad3: function (e) {
    var that = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例 
    var viewWidth = that.data.screenWidth,           //设置图片显示宽度，  
      viewHeight = viewWidth/ ratio;    //计算的高度值   
    this.setData({
      imgwidth3: viewWidth,
      imgheight3: viewHeight
    })
    console.log(that.data.imgwidth3)
    console.log(that.data.imgheight3)
  },
  // 公司动态详情
  detail: function (e) {
    var idd = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/news/news?idd=" + idd ,
    })
  },
  
  // 公司简介详情
  intro: function () {
    wx.navigateTo({
      url: "/pages/introduce-details/introduce-details",
    })
  },
  // 茶叶商城
  product:function(){
    wx.switchTab({
      url: '/pages/product/product',
    })
  },
  // 公司新闻动态列表
  dynamic: function () {
    wx.navigateTo({
      url: "/pages/dynamic-details/dynamic-details",
    })
  },
  // 加盟
  joinIn:function(){
    wx.navigateTo({
      url: '/pages/merchant/merchant',     
    })
  },
  // 商品分类
  ProdCategs:function(e){
    var idd = e.currentTarget.dataset.id
    var namee = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/product_list/product_list?idd=' + idd + "&namee=" + namee,
    })
  },
  // 商品详情
  deta: function (e) {
    var goid = e.currentTarget.dataset.goid;
    wx.navigateTo({
      url: "/pages/goods-details/index?goid=" + goid,
    })
  },
  // 打电话
  phone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone
    })
  },
  // 位置
  // 要给第二个页面传公司位置经纬度
  map: function (e) {
    var long = e.currentTarget.dataset.long;
    var lat = e.currentTarget.dataset.lat;
     wx.navigateTo({
      url: "/pages/maps/maps?long=" + long + "&lat=" + lat,
    })
  },
  controltap(e) {
    let that = this
    wx.openLocation({
      latitude: parseFloat(that.data.latitude),
      longitude: parseFloat(that.data.longitude),
      scale: 28
    })
  },
  phone1:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: "17782833823"
    })
  }
})
