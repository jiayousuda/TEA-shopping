//index.js
//获取应用实例
var app = getApp()
import tempObj from '../template/pwdInput';
Page({
  data: {
    goodsList: [],
    isNeedLogistics: 0, 
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", 
    hasNoCoupons: true,
  },
  
  onLoad: function (e) {
    var that = this;
    var rd_session = app.globalData.userInfo.rd_session;
    console.log(e.goid)
    console.log(e.image)
    console.log(e.name)
    console.log(e.name)
    that.setData({
      goid: e.goid,
      image: e.image,
      name: e.name,
      price: e.price,
    })

    tempObj.init.apply(this, []);
    var coumoney = that.data.coumoney;
    var couid = that.data.couid;
    if (that.data.coumoney) {
      that.setData({
        coumoney: coumoney
      })
    } else {
      that.setData({
        coumoney: 0
      })
    }
    if (that.data.couid) {
      that.setData({
        couid: couid
      })
    } else {
      that.setData({
        couid: 0
      })
    }
    var good_id = e.good_id
    var total_num = e.total_num
    var sku_id = e.sku_id
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType,
      good_id: good_id,
      total_num: total_num,
      sku_id: sku_id
    });
   
    
  },
  onShow: function () {
    var that = this;
    var rd_session = app.globalData.userInfo.rd_session;
   
    var shopList = [];
 
    that.initShippingAddress();
    that.processYunfei();
  },
  //获取默认收货地址
  initShippingAddress: function () {
    var that = this;
    app.ajax(app.ceport.get_default_address, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
      that.setData({
        curAddressData: res.data,
        daaressid: res.data.id
      });
      if (that.data.curAddressData.name == undefined) {
        wx.showModal({
          title: '提示',
          content: '添加默认地址',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/select-address/index'
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    });
  },
  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var allGoodsPrice = 0;
    var isNeedLogistics = 1;
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.sell_price * carShopBean.total_num;
    }
    that.setData({
      isNeedLogistics: isNeedLogistics,
      allGoodsAndYunPrice: allGoodsPrice
    });
  },
  // 添加地址
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  // 选择地址
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },
  //提交
  createOrder: function (e) {
   var that=this
    var goid =that.data.goid;
    app.ajax(app.ceport.get_good_jifen, {
      rd_session: wx.getStorageSync('rd_session'),
      good_id: goid
    }, function (res) {
      // 渲染其他数据
      that.setData({
        info: res.data.data,
        product: res.data.data.lists,
        totalpage: res.data.data.total_page
      })

      console.log(111)

    });
  },
  
})
