var app = getApp();
Page({
  data: {
    list: [],
    name:'',
    // height: 0,
    isOver:true,

    // 下拉加载
    page: 1,
    pagesize:6,
    total_page: 0,//最大页数
    height: 0,
    nomore: true,
  },
  
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight-50 })
      }
    })
    that.setData({
      type_id: options.id,
      name:options.name
    })
    if (!app.check_empty(options.id) && !app.check_empty(options.name)){
      let params = {
       type_id: options.id,
       rd_session: wx.getStorageSync('rd_session'),
       page: that.data.page,
       page_size: that.data.pagesize,
      }
      app.ajax(app.ceport.mendian_list, params, function (res) {
        that.setData({
          list: res.data.list,
          name: options.name,
          total_page: res.data.total_page
        })
      });
    }
  },
  //分享设置
  onShareAppMessage: function () {
    var that = this
    return {
      title: "",
      path: '/pages/pl/plist?id=' + that.data.type_id + "&name=" + that.data.name,
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  
  toxq(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../../pages/pl/plxq?id='+id+"&name="+name,
    })
  },
  callphone(e){
    let num = e.currentTarget.dataset.num
    wx.makePhoneCall({
      phoneNumber: num
    })
  },
  // 滑动到底部 上拉加载
  scrollBottom: function () {
    let that = this;
    that.data.page++
    if (that.data.page > that.data.total_page) {
      that.setData({
        nomore: false
      })
      console.log("xiaoyu ")
      console.log(that.data.page)
      console.log(that.data.total_page)
    } else {
      console.log("dayu ")
      wx.showLoading({
        title: '正在加载',
      })
      app.ajax(app.ceport.mendian_list, {
        type_id: that.data.type_id,
        rd_session: wx.getStorageSync('rd_session'),
        page: that.data.page,
        page_size: that.data.pagesize,
      }, function (res) {
        wx.hideLoading()
        let arr = that.data.list;
        for (let item of res.data.list) {
          arr.push(item);
        }
        that.setData({
          list: arr,
        })
        wx.hideLoading()
      })
    }
  },
  controltap(e) {
    console.log(e)
    this.setData({
      latitude: e.currentTarget.dataset.latitude,
      longitude: e.currentTarget.dataset.longitude
    })
    let that = this
    wx.openLocation({
      latitude: parseFloat(that.data.latitude),
      longitude: parseFloat(that.data.longitude),
      scale: 28
    })
  },
})