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
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null,// 当前选择使用的优惠券
    daaressid: '',
    listt: true,
    shops: [],
    shop: '',
    peis: ['门店自提', '配送'],
    pei: '',
    passWordArr: [],
    passWord: '',
    newpassWord:'',
    isshowpwd: false,
    isshowpwd1: false,
    pay_type:'',
    curAddressData:true
  },
  bindPickerChange: function (e) {
    var that = this;
    
    this.setData({
      index: e.detail.value,
      shop: that.data.shops[e.detail.value]
    })
    var shops_id = that.data.shops_id
    var shopid = shops_id[e.detail.value]
    this.setData({
      shopid: shopid
    })
    console.log(shopid)
  },
  bindPickerChange1: function (e) {
    var that = this;
    this.setData({
      index: e.detail.value,
      pei: that.data.peis[e.detail.value]
    })
  },
  onLoad: function (e) {
    var that = this;
    var rd_session = app.globalData.userInfo.rd_session;
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
    // 选择店铺
    app.ajax(app.ceport.mendian_list, { rd_session: rd_session, type_id: 1 }, function (res) {
      that.setData({
        shops: res.data.list
      })
      var shops = [];
      var shops_id = [];
      res.data.list.forEach(function (i) {
        shops.push(i.name)
        shops_id.push(i.id)
        that.setData({
          shops: shops,
          shops_id: shops_id
        })
      })

    });
    app.ajax(app.ceport.member_info, { rd_session: rd_session }, function (res) {
      that.setData({
        y_money: res.data.data.balance
      })
    })
  },
  onShow: function () {
    var that = this;
    var rd_session = app.globalData.userInfo.rd_session;
    app.ajax(app.ceport.member_info, { rd_session: rd_session }, function (res) {
      that.setData({
        y_money: res.data.data.balance
      })
    })
    if (that.data.aa_type==1){

      that.noUser()
    }
    var couid = that.data.couid;
    var coumoney = that.data.coumoney;
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
    var shopList = [];
    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      app.ajax(app.ceport.get_order_info, { rd_session: wx.getStorageSync('rd_session'), good_id: that.data.good_id, total_num: that.data.total_num, sku_id: that.data.sku_id, coupon_id: that.data.couid }, function (res) {
        var good_info = res.data.data.good_info
        var sku_info = res.data.data.sku_info
        var goodlist = res.data.data
        var can_discount = res.data.data.can_discount
        var discount_fee = res.data.data.discount_fee
        that.setData({
          goodsLists: good_info,
          goodlist: goodlist,
          sku_info: sku_info,
          listt: true,
          goodlist_fee: goodlist.total_fee
        })
        if (can_discount == true) {
          that.setData({
            cancou: true
          })
        } else if (can_discount == false) {
          console.log(that.data.tyype)
          if (that.data.tyype == "来自优惠券") {
            that.setData({
              cancou: false,
              nonecou: "此优惠券不可用"
            })
          } else if (that.data.tyype == undefined) {
            console.log(22992929292929)
            that.setData({
              cancou: false,
              nonecou: "请选择优惠券"
            })
          }
        }
      })
      //购物车下单
    } else {
      app.ajax(app.ceport.cart_list, { status: 1, rd_session: wx.getStorageSync('rd_session'), coupon_id: that.data.couid }, function (res) {
        var lists = res.data.data.list
        var goodlist = res.data.data
        var can_discount = res.data.data.can_discount
        var discount_fee = res.data.data.discount_fee
        that.setData({
          goodsList: res.data.data.list,
          listt: false,
          goodlist: goodlist,
          goodlist_fee: goodlist.total_fee
        })
        if (can_discount == true) {
          that.setData({
            cancou: true
          })
        } else if (can_discount == false) {
          console.log(that.data.tyype)
          if (that.data.tyype == "来自优惠券") {
            that.setData({
              cancou: false,
              nonecou: "此优惠券不可用"
            })
          } else if (that.data.tyype == undefined) {
            console.log(that.data.couid)
            that.setData({
              cancou: false,
              nonecou: "请选择优惠券"
            })
          }
        }
      })
    }
    that.setData({
      goodsList: shopList,
    });
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
              wx.navigateBack({
                
              })
            }
          }
        })
      }
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
    var remark = e.detail.value.remark
    this.setData({
      remark: remark
    })
    var foneid = e.detail.formId
    this.setData({
      foneid: foneid
    })
    var that = this
    if (that.data.pei=="门店自提"){
      that.setData({
        peitype: 2
      })
    }else{
      that.setData({
        peitype: 1
      })
    }
    if ("buyNow" == that.data.orderType) {
      //直接下单+微信
      if (e.detail.value.paytype == "微信") {
        that.setData({
          pay_type:2
        })
        app.ajax(app.ceport.submit_order, { rd_session: wx.getStorageSync('rd_session'), coupon_id: 0, message: remark, address_id: that.data.daaressid, good_id: that.data.good_id, total_num: that.data.total_num, sku_id: that.data.sku_id, coupon_id: that.data.couid, shop: that.data.shop, send_type: that.data.peitype, pay_type: that.data.pay_type, mendian_id: that.data.shopid }, function (res) {
          console.log(app.globalData.userInfo.openId)
          app.wxPay({
            orderno: res.data.order_no,
            openid: app.globalData.userInfo.openId,
            success: function () {
              wx.showToast({
                title: '支付成功哦',
              })
              app.ajax(app.ceport.send_template_message_staff, {
                order_no: res.data.order_no,
                mendian_id: that.data.shopid,
                rd_session: wx.getStorageSync('rd_session'),
                form_id: res.data.prepay_id,
                openid: app.globalData.userInfo.openId
              }, function (res) {

              })
              wx.switchTab({
                url: '/pages/index1/index1',
              })
            },
            fail: function () {
              wx.showToast({
                title: '支付失败哦',
              })
            }
          });
        })
         //直接下单+支付
      } else if (e.detail.value.paytype == "支付") {
        that.setData({
          isshowpwd: true,
          pay_type: 1
        })
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请选择支付方式',
        })
      }
    } else {
     // 购物车+微信
      if (e.detail.value.paytype == "微信") {
        that.setData({
          pay_type: 2
        })
        app.ajax(app.ceport.submit_cart_order, { rd_session: wx.getStorageSync('rd_session'), coupon_id: 0, message: remark, address_id: that.data.daaressid, coupon_id: that.data.couid, send_type: that.data.peitype, pay_type: that.data.pay_type, mendian_id: that.data.shopid }, function (res) {
          app.wxPay({
            orderno: res.data.order_no,
            openid: app.globalData.userInfo.openId,
            success: function () {
              wx.showToast({
                title: '支付成功哦',
              })
              app.ajax(app.ceport.send_template_message_staff, {
                order_no: res.data.order_no,
                mendian_id: that.data.shopid,
                rd_session: wx.getStorageSync('rd_session'),
                form_id: res.data.prepay_id,
                openid: app.globalData.userInfo.openId
              }, function (res) {

              })
              wx.switchTab({
                url: '/pages/index1/index1',
              })
            },
            fail: function () {
              wx.showToast({
                title: '支付失败哦',
              })
            }
          });
        })
      // 购物车+支付宝
      } else if (e.detail.value.paytype == "支付") {
        that.setData({
          isshowpwd: true,
          pay_type:1
        })
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请选择支付方式',
        })
      }
    }
  },
  // 点击确定按钮
  onTapCommit() {
    var that=this
    if (this.data.passWord.length != 6) {
      wx.showToast({
        title: '请输入6位密码',
      })
      return;
    } else if (this.data.passWord.length == 6) {
      this.setData({
        isshowpwd: false
      })
      if ("buyNow" == that.data.orderType) {
        this.submit()
      } else {
        this.submit1()
      }
    }
  },
  // 设置密码
  onTapCommit1() {
    var that = this
    if (this.data.newpassWord.length != 6) {
      wx.showToast({
        title: '请输入6位密码',
      })
      return;
    } else if (this.data.newpassWord.length == 6) {
      this.setData({
        isshowpwd1: false,
      })
      this.setData({
        passWordArr: [],
        passWord: ''
      })
      app.ajax(app.ceport.update_password, { rd_session: wx.getStorageSync('rd_session'), pay_pass: this.data.newpassWord }, function (res) {
        if (res.data.result =="success"){
          if ("buyNow" == that.data.orderType) {
            that.submit()
          } else {
            that.submit1()
          }
        }
       
      })
      console.log(this.data.newpassWord)


    }
  },
   // 直接+余额
  submit: function () {
    var that=this
    if (this.data.newpassWord.length == 6){
      that.setData({
        passWord: this.data.newpassWord
      })
    }
    app.ajax(app.ceport.submit_order, { rd_session: wx.getStorageSync('rd_session'), coupon_id: 0, message: that.data.remark, address_id: that.data.daaressid, good_id: that.data.good_id, total_num: that.data.total_num, sku_id: that.data.sku_id, coupon_id: that.data.couid, shop: that.data.shop, send_type: that.data.peitype, pay_type: that.data.pay_type, pay_pass: that.data.passWord, mendian_id: that.data.shopid }, function (res) {
      wx.showToast({
        icon: 'success',
        title: '支付成功',
      })
      
      app.ajax(app.ceport.send_template_message_staff, {
        order_no: res.data.order_no,
        mendian_id: that.data.shopid,
        form_id: that.data.foneid,
        rd_session: wx.getStorageSync('rd_session')
      }, function (res) {
      })
      wx.switchTab({
        url: '/pages/index1/index1',
      })



    },function(){
      that.setData({
        isshowpwd: false,
        isshowpwd1: true,
      })
    })
    this.setData({
      passWordArr: [],
      passWord: ''
    })
  },
  //购物车+余额
  submit1: function () {
    var that = this
    if (this.data.newpassWord.length == 6) {
      that.setData({
        passWord: this.data.newpassWord
      })
    }
    app.ajax(app.ceport.submit_cart_order, { rd_session: wx.getStorageSync('rd_session'), coupon_id: 0, message: that.data.remark, address_id: that.data.daaressid, coupon_id: that.data.couid, send_type: that.data.peitype, pay_type: that.data.pay_type, pay_pass: that.data.passWord, mendian_id: that.data.shopid}, function (res) {
      wx.showToast({
        icon: 'success',
        title: '支付成功',
      })


      app.ajax(app.ceport.send_template_message_staff, {
        order_no: res.data.order_no,
        mendian_id: that.data.shopid,
        form_id: that.data.foneid,
        rd_session: wx.getStorageSync('rd_session')
      }, function (res) {
       
      })
      wx.switchTab({
        url: '/pages/index1/index1',
      })

    },function(){
      that.setData({
        isshowpwd: false,
        isshowpwd1: true,
      })
    } )

    this.setData({
      passWordArr: [],
      passWord: ''
    })
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
 
  // 使用优惠券
  couponTap: function () {
    wx.navigateTo({
      url: '/pages/vouches/vouches',
    })
  },
  // 不使用优惠券
  noUser: function () {
    this.setData({
      couid: 0,
      aa_type:2
    })
    this.onShow();
    this.setData({
      nonecou: "请选择优惠券"
    })
  },
})
