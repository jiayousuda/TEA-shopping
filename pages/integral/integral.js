var app = getApp()
Page({
  data: {
    statusType:["积分获取","积分消费"],
    currentType: 0,
    rd_type:'',
    aa:false,
    // 下拉加载
    page: 1,
    pagesize:10,
    totalpage: 0,//最大页数  
    height: 0,
    nomore: true,
  },
  
  onShow:function(){
    var rd_session = app.globalData.userInfo.rd_session;
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      }
    })
    // 获取历史记录
    app.ajax(app.ceport.point_record, {
      rd_session: rd_session,
      rd_type: 0,
      page: that.data.page,
      pagesize: that.data.pagesize,
    }, function (res) {
      that.setData({
        recharge: res.data.data.lists,
        totalpage: res.data.total_page,
        total_point: res.data.data.total_point
      })
    })
  },
  statusTap: function (e) {
    var that=this;
    var rd_session = app.globalData.userInfo.rd_session;
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    var aa=!that.data.aa
    console.log(aa)
    this.setData({
      currentType: curType,
      aa:aa
    });
    console.log(that.data.currentType)
    app.ajax(app.ceport.point_record, {
      rd_session: rd_session,
      rd_type: that.data.currentType,
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
      app.ajax(app.ceport.point_record, {
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
  tojf: function () {
    wx.navigateTo({
      url: '/pages/inte_shop/inte_shop',
    })
  },
  togz: function () {
    wx.navigateTo({
      url: '/pages/guize/guize',
    })
  }
})