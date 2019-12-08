var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data: {
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
    currentType: 0,
    tabClass: ["", "", "", "", ""]
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          // 关闭订单
          app.ajax(app.ceport.cancel_order, {
            rd_session: wx.getStorageSync('rd_session'),
            // token: app.globalData.token,
            system_order_no: orderId
          }, function (res) {
            wx.hideLoading();
            if (res.data.result == "success") {
              console.log(111)
              that.onShow();
            }
          });
        }
      }
    })
  },
  toPayTap: function (e) {
    var that = this;
    var orderno = e.currentTarget.dataset.orderno;
    //发起支付请求
    app.wxPay({
      orderno: e.currentTarget.dataset.orderno,
      openid: app.globalData.userInfo.openId,
      success: function () {
        wx.showToast({
          title: '支付成功哦',
        })
        app.ajax(app.ceport.order_list, { rd_session: app.globalData.userInfo.rd_session, status: that.data.currentType }, function (res) {
          wx.hideLoading();
          that.setData({
            orderList: res.data.data.order_list,
            logisticsMap: res.data.logisticsMap,
            goodsMap: res.data.goodsMap
          });

        });
      },
      fail: function () {
        wx.showToast({
          title: '支付失败哦',
        })
      }
    });
  },
  onLoad: function (options) {
    var that = this
    var currentType = options.currindex
    that.setData({
      currentType: currentType
    })
  },
  getOrderStatistics: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
      data: { token: app.globalData.token },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[0] = "red-dot"
          } else {
            tabClass[0] = ""
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[1] = "red-dot"
          } else {
            tabClass[1] = ""
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[2] = "red-dot"
          } else {
            tabClass[2] = ""
          }
          if (res.data.data.count_id_no_reputation > 0) {
            tabClass[3] = "red-dot"
          } else {
            tabClass[3] = ""
          }
          if (res.data.data.count_id_success > 0) {
            //tabClass[4] = "red-dot"
          } else {
            //tabClass[4] = ""
          }

          that.setData({
            tabClass: tabClass,
          });
        }
      }
    })
  },
  onShow: function () {
    // 获取订单列表
    wx.showLoading();
    var that = this;
    app.ajax(app.ceport.order_list, { rd_session: app.globalData.userInfo.rd_session, status: that.data.currentType }, function (res) {
      wx.hideLoading();
      that.setData({
        orderList: res.data.data.order_list,
        logisticsMap: res.data.logisticsMap,
        goodsMap: res.data.goodsMap
      });
    });
  },
  shou: function (e) {
    var that = this
    var orderId = e.currentTarget.dataset.id;
    app.ajax(app.ceport.receive_order, { rd_session: app.globalData.userInfo.rd_session, system_order_no: orderId }, function (res) {
      that.onShow()
    });
  },

  // 查看物流
  // towuliu: function () {
  //   wx.navigateTo({
  //     url: '/pages/logistic/logistic',
  //   })
  // },
  wlinfo(e) {
    var that=this
    let types = e.currentTarget.dataset.type
    let orderno = e.currentTarget.dataset.orderno
    let express_type = e.currentTarget.dataset.express_type
    let express_no = e.currentTarget.dataset.express_no
    let express_name = e.currentTarget.dataset.express_name
    let par = {
      rd_session: app.globalData.userInfo.rd_session,
      order_no: orderno,
      express_type: express_type,
      express_no: express_no
    }
    app.ajax(app.ceport.express_info, par, function (res) {
      that.setData({
        wlist: res.data.data,
        expTextName: express_name,
        showDialog: true
      })
    });
  },

  closewl:function() {
    console.log(11111)
    this.setData({
      showDialog: false
    })
  },

})