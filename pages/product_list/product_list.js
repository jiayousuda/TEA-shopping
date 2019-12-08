const app = getApp()
Page({
  data: {
    // movies: [],
    info: [],
    product: [],
    idd:'',
    namee:'',

    // 下拉加载
    page: 1,
    pagesize: 5,
    totalpage: 0,//最大页数
    height: 0,
    nomore: true,
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      }
    })
    that.setData({
      idd: options.idd,
      namee: options.namee
    })
    console.log(that.data.namee)
    app.ajax(app.ceport.good_list, {
      rd_session: wx.getStorageSync('rd_session'),
      catid: that.data.idd, page: that.data.page,
      pagesize: that.data.pagesize}, function (res) {
      // 渲染其他数据
      that.setData({
        info: res.data,
        product: res.data.list,
        totalpage: res.data.total_page
      })
      console.log(res.data);
      // wxParse.wxParse("about", "html", res.data.about.content, that)
    });
  },

  // 滑动到底部 上拉加载
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
      app.ajax(app.ceport.product_list, {
        catid: that.data.idd,
        page: this.data.page,
        pagesize: this.data.pagesize
      }, function (res) {
        wx.hideLoading()
        let arr = that.data.product;
        for (let item of res.data.lists) {
          arr.push(item);
        }
        that.setData({
          product: arr,
        })
        wx.hideLoading()
      })
    }
  },

  deta: function (e) {
    console.log(e)
    var goid = e.currentTarget.dataset.goid;
    wx.redirectTo({
      url: "/pages/goods-details/index?goid=" + goid, 
    })
  },
  proList: function () {
    wx.navigateTo({
      url: "/pages/product_list/product_list",
    })
  }

})
