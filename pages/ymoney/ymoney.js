var app = getApp()
Page({
  data: {
    height:0,
    money:0,
    list:[],
    showeditdialog:false,
  },
  onShareAppMessage: function (res) {
    app.shareApp(res)
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight-176 })
      }
    })
    let params = {
      rd_session: app.globalData.userInfo.rd_session,
    }
    
    // 展示
    app.ajax(app.ceport.recharge_card, {
      rd_session: app.globalData.userInfo.rd_session
    }, function (res) {
      that.setData({
        money: res.data.data.balance,
        list: res.data.data.list
      })
    })
    
  },
  //充值 
  chongz(e){
    var id = e.target.dataset.id
    this.chongz2(id)
  },
  chongz2(id){
    let param = {
      rd_session: app.globalData.userInfo.rd_session,
    }
   
    app.ajax(app.ceport.applay_recharge_card, {
      rd_session: app.globalData.userInfo.rd_session,
      card_id: id
    }, function (res) {
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
    })


    
  },
  // 消费记录
  tolist(e){
    var id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/cash/cash',
    })
  },
  tolist1(e) {
    var id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/c_money1/c_money1',
    })
  },
  formSubmit: function (e) {
    var that=this
    if (!app.check_empty(e.detail.value.pwd)) {
      var rd_session =app.globalData.userInfo.rd_session
      var param = { rd_session: rd_session, pass: e.detail.value.pwd}
      app.ajax(app.ceport.edit_pass, param , function (res) {
        if (res.data.result == 'success') {
          that.setData({
            showeditdialog: false
          })
          wx.showToast({
            title: res.data.message,
            duration: 2000
          })
          this.chongz(this.data.czid)
        }
      })

    } else {
      wx.showToast({
        title: '有信息没有填写哦~',
        duration: 2000
      })
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    this.setData({
      showeditdialog: false
    })
    console.log('form发生了reset事件')
  },
  editpwd(){
    this.setData({
      showeditdialog:true
    })
  },
  tojf:function(){
    wx.navigateTo({
      url: '/pages/inte_shop/inte_shop',
    })
  },
  togz:function(){
    wx.navigateTo({
      url: '/pages/guize/guize',
    })
  }
    
})  