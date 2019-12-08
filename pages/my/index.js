const app = getApp()

Page({
	data: {
    balance:0,
    freeze:0,
    score:0,
    score_sign_continuous:0
  },
  // 转发
  onShareAppMessage: function (res) {

  },
	onLoad() {
    
	},	
  onShow() {
    this.getUserInfo();
    this.setData({
      version: app.globalData.version
    });
  },	
  getUserInfo: function (cb) {
      var that = this
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo
              });
            }
          })
        }
      })
  },
  // 绑定手机号码
  getPhoneNumber: function(e) {
    console.log(e);
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    app.ajax(app.ceport.bindMobile, {rd_session: wx.getStorageSync('rd_session'), phone:e.detail.encryptedData,iv:e.detail.iv}, function (res) {
      wx.hideLoading();
    });
  },
  showOrder: function (e) {
    var currindex = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/order-list/index?currindex=' + currindex,
    })
  },
  phone1: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: "17782833823"
    })
  },
})