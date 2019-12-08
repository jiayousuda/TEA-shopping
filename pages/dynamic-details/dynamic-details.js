const app = getApp()
Page({

  
  data: {
    movies: [
    ],
    info:[],
    // 下拉加载
    page: 1,
    pagesize: 5,
    totalpage: 0,//最大页数
    height: 0,
    nomore: true,
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      }
    })
    app.ajax(app.ceport.content_list, {
      rd_session: wx.getStorageSync('rd_session'),
      page: that.data.page,
      pagesize: that.data.pagesize
      }, function (res) {
      // 渲染其他数据
      that.setData({
        info: res.data.lists,
        movies: res.data.ad_list,
        totalpage: res.data.total_page
      })
    });
  },

  //滑动到底部 上拉加载
  scrollBottom: function () {
    let that = this;
    that.data.page++
    if (that.data.page > that.data.totalpage) {
      that.setData({
        nomore: false
      })
    } else {
      wx.showLoading({
        title: '正在加载',
      })
      app.ajax(app.ceport.content_list, {
        page: this.data.page,
        pagesize: this.data.pagesize
      }, function (res) {
        wx.hideLoading()
        let arr = that.data.info;
        for (let item of res.data.lists) {
          arr.push(item);
        }
        that.setData({
          info: arr,
        })
        wx.hideLoading()
      })
    }

  },


  news:function(e){
    var idd = e.currentTarget.dataset.id;
    wx:wx.navigateTo({
      url: '/pages/news/news?idd='+idd,
    })
  }
})