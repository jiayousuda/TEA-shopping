//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    coupons:[], 
    page:1
  },
  onLoad: function () {
  },
  onShow : function () {
    this.getMyCoupons();
  },
  getMyCoupons: function () {
    var that = this;
    var rd_session = wx.getStorageSync('rd_session');
    app.ajax(app.ceport.member_coupon, { rd_session:rd_session,pagesize: 6 ,page:that.data.page}, function (res) {
      that.setData({
        coupons: res.data.list
      });
    });
    //折扣
    // app.ajax(app.ceport.discounts, {
    //   token: app.globalData.token,
    //   status: 0}, function (res) {
    //     if (res.data.code == 0) {
    //       var coupons = res.data.data;
    //       if (coupons.length > 0) {
    //         that.setData({
    //           coupons: coupons
    //         });
    //       }
    //     }
    // });


  },
  goBuy:function(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }

})
