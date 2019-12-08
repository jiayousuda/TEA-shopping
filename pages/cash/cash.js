var app = getApp()
Page({
  data: {
    // 下拉加载
    page: 1,
    pagesize: 4,
    totalpage: 0,//最大页数  
    height: 0,
    nomore: true,
  },
  onLoad: function (options) {
    var rd_session = app.globalData.userInfo.rd_session;
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      }
    })
    // 获取历史记录
    app.ajax(app.ceport.cash_record, {
      rd_session: rd_session,
       page: that.data.page,
      pagesize: that.data.pagesize,
    }, function (res) {
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
      app.ajax(app.ceport.cash_record, {
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
})