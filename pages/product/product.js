const app = getApp()
Page({
  data: {
    movies: [],
    info:[],
    product:[],
    goodlist:[],
    item:true,
    imgwidth3: 0,
    imgheight3: 0,
    screenHeight: 0,
    screenWidth: 0
  },
  onShareAppMessage: function (res) {
   
  },
  imageLoad3: function (e) {
    var that = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例 
    var viewWidth = that.data.screenWidth,           //设置图片显示宽度，  
      viewHeight = viewWidth / ratio;    //计算的高度值   
    this.setData({
      imgwidth3: viewWidth,
      imgheight3: viewHeight
    })
  },
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    }); 
    app.ajax(app.ceport.good_index, { rd_session: wx.getStorageSync('rd_session')}, function (res) {
      // 渲染其他数据
      that.setData({
        movies: res.data.ad_list,
        product: res.data.data.list,
        goodlist: res.data.data.list.good_list,
      })
    });
  },
  deta:function(e){
    var goid = e.currentTarget.dataset.goid;
    console.log(goid)
    wx.navigateTo({
      url: "/pages/goods-details/index?goid="+goid,
    })
  },
  proList:function(e){
    console.log(e)
    var idd = e.currentTarget.dataset.id;
    var namee = e.currentTarget.dataset.name;
    console.log(namee)
    wx.navigateTo({
      url: "/pages/product_list/product_list?idd=" + idd + "&namee=" + namee,
    })
  },
  phone1: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: "17782833823"
    })
  }
  
})
