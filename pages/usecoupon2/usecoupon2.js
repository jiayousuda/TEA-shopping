var app = getApp();
var config = require('../../config.js')
Page({
  data: {
    coupons: [],//优惠券集合
    con: [],//优惠券金额数组
    full: [],//满减金额数组
    order_id: "",
    order_type: '',
    order_no: '',
    index: '',//优惠券的index
    cuponid: '',//优惠券id
    prefer: '',//优惠券金额
    full2: '',//满减金额
  },
  onLoad: function (options) {
    this.setData({
      gyh: options.gyh
    })
    var that = this
    that.setData({
      order_id: options.order_id,
      order_no: options.order_no,
      order_type: options.order_type
    })
    //获取优惠券数据
    var rd_session = wx.getStorageSync('rd_session');
    var my_coupon = [];

    app.ajax(app.ceport.member_coupon, { rd_session: rd_session, order_id: that.data.order_id,mchid:config.mchid}, function (res) {
      var con = [];//优惠券金额数组
      var full = [];//满减金额数组
      res.data.list.forEach(function (i) {
        con.push(i.fee)
        full.push(i.condition)
      })
      that.setData({
        con: con,
        full: full
      })
      if (res.data.list.length > 0) {
        that.setData({
          coupons: res.data.list
        })
      } else {
        that.setData({
        })
      }
    })






  },
  // 使用优惠券
  tapUse: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var cuponid = e.currentTarget.dataset.id;
    that.setData({
      index: index,
      cuponid: cuponid
    })
    app.ajax(app.ceport.check_coupon, {
      coupon_id: cuponid,
      rd_session: app.globalData.userInfo.rd_session,mchid: config.mchid }, function (res) {
        if (res.data.result == 'success') {
          var conn = that.data.con//优惠券金额数组
          var full = that.data.full//满减金额数组
          that.setData({
            prefer: conn[index],
            full2: full[index]
          })
          var full2 = that.data.full2//满减
          var prefer = that.data.prefer//优惠券金额
         

          var gyh = Number(that.data.gyh)
          var full2 = Number(full2)
          if (gyh < full2) {
            wx.showToast({
              title: '优惠额不满' + full2 + "元",
              icon: 'loading',
            })
            prevPage.setData({
              prefer:0,
            })
            // app.globalData.prefer=0
          } else {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];//上一个A页面
            prevPage.setData({
              prefer: prefer,
              full2: full2,
              cuponid2: that.data.cuponid,
              typeid: "yh",
              aa_type:'2'
            })
            wx.navigateBack({
              delta: 1
            });  //返回上一个页面
          }
        }
        else {
          wx.showToast({
            title: res.data.message,
            duration: 1500
          })


        }
    })


  },

  partic:function(){
    var that=this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//上一个A页面
    prevPage.setData({
      aa_type:1
    })
    wx.navigateBack({
      delta: 1
    });  //返回上一个页面
  }
})