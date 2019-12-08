var app = getApp()
var config = require('../../config.js')
import tempObj from '../template/pwdInput';
Page({ 
  data: {
    shop_name: '',//商家名称
    movies: [],
    width: '',
    item: true,
    coupons: [],
    isno: true,
    cuponid: 0,
    toal_fee: 0,
    undiscount: 0,
    amount: true,
    con: '',//所有优惠券金额数组
    amount2: '',//总金额
    prefer: 0,//优惠券金额
    full: '',//满减金额数组
    full2: 0,//满减金额
    goodlist_fee: 0,//最后应支付=总金额-优惠券金额
    index: '',
    shops: [],
    shop: '',
    isshowpwd: false,
    passWordArr: [],
    passWord: '',
    newpassWord: '',
    isshowpwd: false,
    isshowpwd1: false,
    pay_type: '',
    focus:true
  },
  radioChange: function (e) {
    this.setData({
      value: e.detail.value
    })
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

  },
  
  //初始化
  onLoad: function (options) {
      var rd_session = app.globalData.userInfo.rd_session;
      tempObj.init.apply(this, []);
      var that = this
      // 获取商家名称
      this.setData({
        shop_name: app.globalData.shop_name
      })
      // 获取banner图
      app.ajax(app.ceport.index, { rd_session: rd_session, mchid: config.mchid }, function (res) {
        that.setData({
          movies: res.data.ad_list
        })
      })
      // 余额
      app.ajax(app.ceport.member_info, { rd_session: rd_session }, function (res) {
        that.setData({
          y_money: res.data.data.balance
        })
      })
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
      //获取优惠券数据
      var my_coupon = [];
      app.ajax(app.ceport.member_coupon, { rd_session: rd_session, mchid: config.mchid }, function (res) {
        var con = [];//优惠券金额数组
        var full = [];//满减金额数组
        res.data.list.forEach(function (i) {
          con.push(i.fee)
          full.push(i.condition)
        })
        that.setData({
          con: con,
          full: full
        })
        if (res.data.list.length > 0) {
          that.setData({
            isno: true,
            coupons: res
          })
        } else {
          that.setData({
            isno: false,
          })
        }
      })
      //重新获取高度
      wx.getSystemInfo({
        success: function (res) {
          var width = "width:" + res.windowWidth + 'px;';
          that.setData({
            width: width,
          })
        }
      });
  },
  onShow: function () {
    var that = this
    
    if (this.data.typeid == "yh") {
      console.log(this.data.typeid)
      var rd_session = app.globalData.userInfo.rd_session;
      // 余额
      app.ajax(app.ceport.member_info, { rd_session: rd_session }, function (res) {
        that.setData({
          y_money: res.data.data.balance
        })
      })
      if (that.data.aa_type == 1) {
        that.nouser();
      }
      if (that.data.prefer !== 0) {
        that.setData({
          amount: false,
          item: true,
        })
        var amount2 = '';
        var amount2 = that.data.amount2;
        that.setData({
          amount2: amount2,
          prefer: that.data.prefer
        })
        console.log(amount2)
        console.log(that.data.prefer)
        var full2 = that.data.full2//满减金额
        var prefer = that.data.prefer//优惠券金额
        var goodlist_fee = that.data.goodlist_fee//支付金额
          that.setData({
            goodlist_fee: Number(amount2 ) - Number(prefer)
          })
      }
    } else {
      var amount2 = that.data.amount2;
      var full2 = that.data.full2//满减金额
      var prefer = that.data.prefer//优惠券金额
      var goodlist_fee = that.data.goodlist_fee//支付金额
      that.setData({
        // shop: '',
        amount2: amount2,
        goodlist_fee: Number(amount2) - Number(prefer)
      })
     
    }
   
  },
  // 立即购买
  bindSave: function (e) {
    var foneid = e.detail.formId
    this.setData({
      foneid: foneid
    })
    var that = this;
    var rd_session = wx.getStorageSync('rd_session');
    if (that.data.shop == '') {
      wx.showToast({
        title: '请选择门店',
      })
    } else if (e.detail.value.amount2 == '' ) {
      wx.showToast({
        title: '请输入金额',
      })
    } else {
      if (that.data.value == "微信") { 

        app.ajax(app.ceport.build_payorderparam, {
          mchid: config.mchid,
          rd_session: rd_session,
          openid: app.globalData.userInfo.openId,
          total_fee: that.data.total_fee,
          undiscount: that.data.undiscount,
          coupon_id: app.globalData.cuponid2,
          mendian_id: that.data.shopid,
          pay_type:1
        }, function (res) {
          var param = res.data;
          if (param.result == 'error') {
            wx.showToast({
              title: param.message
            })
          } else {
            wx.requestPayment({
              'timeStamp': param.timeStamp,
              'nonceStr': param.nonceStr,
              'package': param.package,
              'signType': 'MD5',
              'paySign': param.paySign,
              success: function (res) {
                app.wxPaySuccess(param);
                typeof param.success === 'function' && param.success();


                app.ajax(app.ceport.send_template_message_staff, {
                  order_no:res.data.order_no,
                  mendian_id: that.data.shopid, 
                  rd_session: rd_session,
                  form_id: res.data.prepay_id,
                  openid: app.globalData.userInfo.openId
                }, function (res) {
                 
                })


              },
              fail: function (res) {
                if (res.errMsg === 'requestPayment:fail cancel') {
                  typeof param.fail === 'function' && param.fail();
                  return;
                }
                wx.showToast({
                  title: res.errMsg
                })
                app.wxPayFail(param, res.errMsg);
                typeof param.fail === 'function' && param.fail();
              }
            })
          }
        })
      } else if (that.data.value == "支付") {
        that.setData({
          passWordArr: [],
          passWord: ''
        })
        app.ajax(app.ceport.check_pass, {
          rd_session : wx.getStorageSync('rd_session')
        }, function (res) {
          if (res.data.data ==true){
            that.setData({
              isshowpwd: true,
              pay_type: 1
            })
          }else{
            that.setData({
              isshowpwd1: true,
              pay_type: 1
            })
          }
        })
       
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请选择支付方式',
        })
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
        if (res.data.result == "success") {
          that.pay()
        }

      })
    }
  },
  // 点击确定按钮
  onTapCommit() {
    var that = this
    if (this.data.passWord.length != 6) {
      wx.showToast({
        title: '请输入6位密码',
      })
      return;
    } else if (this.data.passWord.length == 6) {
      this.setData({
        isshowpwd: false
      })
      this.submit()
    }
  },
  submit:function(){
    var that=this
    var rd_session = wx.getStorageSync('rd_session');
    app.ajax(app.ceport.build_payorderparam, {
      mchid: config.mchid,
      rd_session: rd_session,
      openid: app.globalData.userInfo.openId,
      total_fee: that.data.total_fee,
      undiscount: that.data.undiscount,
      coupon_id: app.globalData.cuponid2,
      mendian_id: that.data.shopid,
      pay_type: 2,
      password: that.data.passWord
    }, function (res) {
      var param = res.data;
      if (param.result == 'error') {
        wx.showToast({
          title: param.message
        })
        that.setData({
          passWordArr: [],
          passWord: ''
        })
      } else {
        wx.showToast({
          title:"支付成功"
        })
       
        app.ajax(app.ceport.send_template_message_staff, {
          order_no: res.data.data.order_no,
          mendian_id: that.data.shopid,
          form_id: that.data.foneid,
          rd_session:rd_session,
          openid: app.globalData.userInfo.openId
        }, function (res) {
         
        })
        wx.switchTab({
          url: '/pages/index1/index1',
        })
      }
      
    })
  },
  // 同步总金额
  amount2: function (e) {
    var that = this
    that.setData({
      amount2: e.detail.value,
      goodlist_fee: e.detail.value,
      total_fee: e.detail.value
    })
    var amount2 = that.data.amount2//总金额
    var prefer = that.data.prefer//优惠券金额
      that.setData({
        goodlist_fee: Number(amount2) - Number(prefer),
      })
  },
  // 同步不参与金额
  partic: function (e) {
    var that = this
    this.setData({
      partic: e.detail.value,
      undiscount: e.detail.value
    })
    var amount2 = that.data.amount2//总金额
    var partic = that.data.partic//不参与
    var full2 = that.data.full2//满减
    var prefer = that.data.prefer//优惠券金额
    if (Number(amount2) - Number(partic) > Number(full2) || Number(amount2) - Number(partic) == Number(full2)) {
      that.setData({
        goodlist_fee: Number(amount2) - Number(prefer)
      })
    } else {
      that.setData({
        goodlist_fee: amount2,
        prefer: 0
      })
    }
  },
  // 商家优惠券
  coupon: function () {
    var gyh = Number(this.data.amount2) - Number(this.data.partic)
    var that = this
   
    if (that.data.amount2 == '') {
      wx.showToast({
        title: '请输入消费金额',
        icon: 'loading',
      })
    } else {
      wx.navigateTo({ url: '/pages/usecoupon2/usecoupon2' + "?gyh=" + gyh + '&mchid=' + config.mchid })
    }

  },
  // 取消遮罩层
  b: function () {
    var that = this
    that.setData({
      item: true,
    })
  },
  nouser: function () {
    var that = this
    var amount2 = that.data.amount2
    var prefer = 0//商家优惠金额
    app.globalData.cuponid2 = 0
    that.setData({
      amount2: that.data.amount2,
      partic: that.data.partic,
      prefer: 0,
      goodlist_fee: Number(amount2) - Number(prefer),
      amount: true
    })
    // this.onShow();
  },
  phone1: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: "17782833823"
    })
  },
})
