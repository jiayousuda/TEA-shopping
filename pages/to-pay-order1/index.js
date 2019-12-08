//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null ,// 当前选择使用的优惠券
    daaressid:'',
    listt:true
  },
  onLoad: function (e) {
    var that = this;
    console.log(e.orderType)
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
    console.log(11111)
    var that = this;
    var shopList = [];
    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      app.ajax(app.ceport.get_order_info, { rd_session: wx.getStorageSync('rd_session'), good_id: that.data.good_id, total_num: that.data.total_num, sku_id:0}, function (res) {
        var good_info = res.data.data.good_info
        var sku_info = res.data.data.sku_info
        var goodlist = res.data.data
        that.setData({
          goodsLists: good_info,
          goodlist: goodlist,
          sku_info: sku_info,
          listt:true
        })
      })
   //购物车下单
    } else {
      app.ajax(app.ceport.cart_list, { status:1, rd_session: wx.getStorageSync('rd_session') }, function (res) {
        console.log(res.data.list);
        var lists=res.data.list
        var goodlist = res.data
        that.setData({
          goodsList: res.data.list,
          listt: false,
          goodlist: goodlist
        })
       
      })
    }
    that.setData({
      goodsList: shopList,
    });
    that.initShippingAddress();
    
    that.processYunfei();
  },
  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },
//提交
  createOrder: function (e) {
    console.log(e)
    var remark = e.detail.value.remark
    var that=this
    if ("buyNow" == that.data.orderType){
      console.log("直接")
      app.ajax(app.ceport.submit_order, { rd_session: wx.getStorageSync('rd_session'), coupon_id: 0, message: remark, address_id: that.data.daaressid, good_id: that.data.good_id, total_num: that.data.total_num, sku_id: that.data.sku_id }, function (res) {


      })
    }else{
      console.log("购物车")
      app.ajax(app.ceport.submit_cart_order, { rd_session: wx.getStorageSync('rd_session'), coupon_id: 0, message: remark, address_id: that.data.daaressid }, function (res) {
        // that.setData({
        //   miao_list: res.data.data.miao_list,
        //   dapai_list: res.data.data.dapai_list,
        //   dianzhang_list: res.data.data.dianzhang_list,
        // });
      })
    }
    
   
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
  //获取默认收货地址
  initShippingAddress: function () {
    var that = this;
    app.ajax(app.ceport.get_default_address, {rd_session:wx.getStorageSync('rd_session') }, function (res) {
      that.setData({
        curAddressData: res.data,
        daaressid: res.data.id
      });
      console.log(that.data.curAddressData.name )
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
      that.getMyCoupons();

    });
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },
  getMyCoupons: function () {
    var that = this;

    app.ajax(app.ceport.member_coupon, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
      var coupons = res.data.list.filter(entity => {
        return entity.fee <= that.data.allGoodsAndYunPrice;
      });
      if (coupons.length > 0) {
        that.setData({
          hasNoCoupons: false,
          coupons: coupons
        });
      }
    });
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon: null
      });
      return;
    }
    this.setData({
      youhuijine: this.data.coupons[selIndex].fee,
      curCoupon: this.data.coupons[selIndex]
    });
  }
})
