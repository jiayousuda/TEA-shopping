var app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    var that = this;
  },
  onShow: function () {
    var that = this;
    that.getMyCoupons();
  },
  getMyCoupons: function () {
    var that = this;

    app.ajax(app.ceport.member_coupon, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
      var coupons = res.data.list.filter(entity => {
        return entity.fee <= that.data.allGoodsAndYunPrice;
      });
      var couponsList = res.data.list
      if (couponsList.length > 0) {
        that.setData({
          coupons: couponsList
        });
      }
    });
  },
  usecoupon: function (e) {
    var couid = e.currentTarget.dataset.couid
    var coumoney = e.currentTarget.dataset.coumoney
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//上一个A页面
    prevPage.setData({
      couid: couid,
      tyype:"来自优惠券"
    })
    wx.navigateBack({

    })
  },
  partic: function () {
    var that = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//上一个A页面
    prevPage.setData({
      aa_type: 1
    })
    wx.navigateBack({
      // delta: 1
    });  //返回上一个页面
  }
})