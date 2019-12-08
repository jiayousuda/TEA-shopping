var app = getApp();
var w=0
Page({
  data: {
    height: 0,
    info:'',
    name:'',
    latitude:'',
    longitude:'',
    controls: [
    ],
    markers:[],
    imgwidth3: 0,
    imgheight3: 0,
    screenHeight: 0,
    screenWidth: 0,
  },
  onShareAppMessage: function (res) {
    app.shareApp(res)
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    }); 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight-50 })
      }
    })
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        w = res.screenWidth - 50 - 35
        let carr = []
        let c = {
          id: 1,
          iconPath: '/images/biao.png',
          position: {
            left: w,
            top: 240,
            width: 50,
            height: 50
          },
          clickable: true
        }
        carr.push(c)
        self.setData({
          height: res.windowHeight - 50,
          width: res.screenWidth,
          controls: carr
        })
      }
    })
    if (!app.check_empty(options.id) && !app.check_empty(options.name)){
      let params = {
        shop_id: options.id,
        rd_session: wx.getStorageSync('rd_session')
      }
      app.ajax(app.ceport.mendian_detail, params, function (res) {
        that.setData({
          info: res.data.data.detail,
          name: options.name,
          longitude: res.data.data.detail.longitude,
          latitude: res.data.data.detail.latitude,
          movies: res.data.data.banner
        })
        var mar=[]
        var mar_com={};
        mar_com.iconPath = "/images/weizhi.png"
        mar_com.latitude = res.data.data.detail.latitude
        mar_com.longitude = res.data.data.detail.longitude
        mar_com.width = 10
        mar_com.height = 20
        mar.push(mar_com)
        that.setData({
          markers: mar
        })
      });
    }
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
    console.log(that.data.imgwidth3)
    console.log(that.data.imgheight3)
  },
  callphone(e) {
    let num = e.currentTarget.dataset.num
    wx.makePhoneCall({
      phoneNumber: num
    })
  },
  controltap(e) {
    let that = this
    wx.openLocation({
      latitude: parseFloat(that.data.latitude),
      longitude: parseFloat(that.data.longitude),
      scale: 28
    })
  },
})