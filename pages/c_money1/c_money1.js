var app = getApp()
var config = require('../../config.js')
Page({
  data: {
    shop_name: '',//商家名称
    movies: [], 
    width: '',
    amount2:'',
    // 下拉加载
    page: 1,
    pagesize:4,
    totalpage: 0,//最大页数  
    height: 0,
    nomore: true,
  },
  //初始化
  onLoad: function (options) {
    var rd_session = app.globalData.userInfo.rd_session;
    var that = this
    //获取商家名称
    this.setData({
      shop_name: app.globalData.shop_name
    })
    //重新获取高度
    wx.getSystemInfo({
      success: function (res) {
        var width = "width:" + res.windowWidth + 'px;';
        that.setData({
          width: width,
        })
      }
    });
    //获取历史记录
    app.ajax(app.ceport.recharge_record, {
      rd_session: rd_session, page: that.data.page,
      pagesize: that.data.pagesize,}, function (res) {
      that.setData({
        recharge: res.data.data.lists,
        totalpage: res.data.total_page
      })
    })
  },
  //滑动到底部 上拉加载
  scrollBottom: function () {
    var rd_session = app.globalData.userInfo.rd_session;
    this.data.page++
    if (this.data.page > this.data.totalpage) {
      this.setData({
        nomore: false
      })
    } else {
      wx.showLoading({
        title: '正在加载',
      })
      let that = this;
      app.ajax(app.ceport.recharge_record,{
        rd_session: rd_session,
        page: that.data.page,
        pagesize: that.data.pagesize,
      }, function (res) {
        wx.hideLoading()
        let arr = that.data.recharge;
        for (let item of res.data.data.lists) {
          arr.push(item);
        }
        that.setData({
          orderlist: arr
        })
        wx.hideLoading();
      })
    }
  },
  //充值
  pay: function () {
    var that = this;
    var rd_session = wx.getStorageSync('rd_session');
    if (that.data.amount2!==''){
      app.ajax(app.ceport.applay_recharge, { fee: that.data.amount2, rd_session: rd_session }, function (res) {
        if (res.data.result == "success") {
          console.log(res.data.data.order_no)
          console.log(res.data.data.order_id)
          app.wxPay1({
            orderno: res.data.data.order_no,
            openid: app.globalData.userInfo.openId,
            success: function () {
              wx.showToast({
                title: '充值成功',
              })
              wx.switchTab({
                url: '/pages/index1/index1',
              })
            },
            fail: function () {
              wx.showToast({
                title: '支付失败哦',
              })
            }
          });
        }
      })
    }else{
      wx.showToast({
        title: '请填写金额',
      })
    }
   
 

  },
  // 同步总金额
  amount2: function (e) {
    var that = this
    that.setData({
      amount2: e.detail.value,
    })
  },
})
