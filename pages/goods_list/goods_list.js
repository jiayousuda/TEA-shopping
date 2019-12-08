var app = getApp();
Page({
  data: {
    goods_list: [],
    order: 'sell',
    order_type: 'desc',
    pd1: false,
    pd2: true,
    pd3: true,
    catid: '',

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

    var catid = options.catid
    that.setData({
      catid: catid,
    });
    var dat = {
      catid: catid,
      order: that.data.order,
      order_type: that.data.order_type,
      page: this.data.page,
      pagesize: this.data.pagesize
    }
    that.getGoodList(dat)
  },
  onShow: function (options) {
    var that = this
    var dat = {
      catid: that.data.catid,
      order: that.data.order,
      order_type: that.data.order_type,
      page: this.data.page,
      pagesize: this.data.pagesize
    }
    var pd1 = that.data.pd1
    var pd2 = that.data.pd2
    var pd3 = that.data.pd3
    if (that.data.order == "sell") {
      that.setData({
        pd1: !pd1,
      })
    } else if (that.data.order == "price") {
      that.setData({
        pd2: !pd2,
      })
    } else if (that.data.order == "time") {
      that.setData({
        pd3: !pd3,
      })
    }
    that.getGoodList(dat)
  },
  getGoodList: function (e) {
    var that = this
    //商品列表
    app.ajax(app.ceport.good_list, e, function (res) {
      that.setData({
        goods_list: res.data.data.list,
        totalpage: res.data.data.total_page
      });
    })
  },
  //商品详情
  toDetailsTap: function (e) {
    wx.redirectTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  // 
  currrnav: function (e) {
    var that = this
    var order = e.currentTarget.dataset.order;
    var order_type = e.currentTarget.dataset.order_type;
    console.log(that.data.height)
    that.setData({
      order: order,
      order_type: order_type,
      page: 1,
      pagesize: 5,
      totalpage: 0,
      nomore: true,
    })
    this.onShow()
  },


//滑动到底部 上拉加载

    scrollBottom: function () {
    this.data.page++
    if (this.data.page > this.data.totalpage) {
      this.setData({
        nomore: false
      })
    } else {
      console.log(22222)
      wx.showLoading({
        title: '正在加载',
      })
      let that = this;
      app.ajax(app.ceport.good_list, {
        catid: that.data.catid,
        order: that.data.order,
        order_type: that.data.order_type,
        page: this.data.page,
        pagesize: this.data.pagesize}, function (res) {
          wx.hideLoading()
          let arr = that.data.goods_list;
          for (let item of res.data.data.list) {
            arr.push(item);
          }
          that.setData({
            goods_list: arr
          })
          wx.hideLoading()
      })
    }
  },


})