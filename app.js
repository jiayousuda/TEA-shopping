//app.js
var config = require('./config.js'), code_type = 0, mendian_id = 0;
App({

  onLaunch: function (options) {
    
    wx.showShareMenu({
      withShareTicket: true
    })
    if (options.query.scene && isNaN(options.query.scene)) {
      var s = options.query.scene;
      var qtype = new RegExp('type');
      var and = new RegExp('@');
      var mendian = new RegExp('mendian');
      if (qtype.test(s) && mendian.test(s) && and.test(s)) {
        var arr = s.split('@');
        var arr_type = arr[0].split('_');
        var arr_mendian = arr[1].split('_');
        code_type = arr_type[1];
        mendian_id = arr_mendian[1]
      }
    }
    else {
      code_type = 'normal'
      mendian_id = 0
    }
    var that = this;
    var rd_session = wx.getStorageSync('rd_session');
    wx.getExtConfig({
      success: function (res) {
        wx.setStorageSync('appkey', res.extConfig.appkey);
      }
    })
    if (!rd_session) {
      that.login();
    } else {
      wx.checkSession({
        success: function () {
          that.check_rdsession();
        },
        fail: function () {
          //登录态过期
          that.login();
        }
      })
    }
  },
  login: function () {
    var self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({
            success: function (res) {
              var rawData = res['rawData'];
              var signature = res['signature'];
              var encryptData = res['encryptData'];
              var encryptedData = res['encryptedData'];
              var iv = res['iv'];
              //发起网络请求
              var data = {
                "code": code,
                code_type:code_type,
                mendian_id:mendian_id,
                "rawData": rawData,
                "signature": signature,
                "encryptData": encryptData,
                'iv': iv,
                'mchid': wx.getStorageSync('appkey'),
                'encryptedData': encryptedData
              }
              self.ajax(self.ceport.login, data, function (ress) {
                if (ress.data.result == 'success') {
                  self.globalData.userInfo = ress.data;
                  self.globalData.hasLogin = true;
                  wx.setStorageSync('rd_session', ress.data.rd_session);
                  wx.setStorageSync('userinfo', ress.data);
                } else {
                  wx.showToast({
                    title: '第三方登录失败'
                  })
                }
              });
            }
          });
        } else {
        }
      }
    });
  },
  check_rdsession: function () {
    var self = this;
    var rd_session = wx.getStorageSync('rd_session');
    this.ajax(this.ceport.check_login, { rd_session: rd_session }, function (res) {
      if (res.message == 'offline') {
        wx.clearStorageSync();
        wx.removeStorageSync("rd_session");
        self.login();
      } else {
        self.globalData.hasLogin = true;
        self.globalData.userInfo = wx.getStorageSync('userinfo');
      }
    })
  },
  check_online: function () {
    var self = this;
    var rd_session = wx.getStorageSync('rd_session');
    if (!rd_session) {
      self.login();
    } else {
      wx.checkSession({
        success: function () {
          self.check_rdsession();
        },
        fail: function () {
          //登录态过期
          self.login();
        }
      })
    }
  },
  buildpayparam: function (order_no, openid) {
    _this.ajax(_this.ceport.build_payparam, { order_no: order_no, openid: openid, order_type: order_type }, function (res) {
      return res.data;
    });

  },

  check_empty: function (v) {
    switch (typeof v) {
      case 'undefined':
        return true;
      case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
        break;
      case 'boolean':
        if (!v) return true;
        break;
      case 'number':
        if (0 === v || isNaN(v)) return true;
        break;
      case 'object':
        if (null === v || v.length === 0) return true;
        for (var i in v) {
          return false;
        }
      default:
        return true;
    }
    return false;
  },
  sendTemplate: function (formId, templateData, success, fail) {
    var app = getApp();
    this.getJSON({
      url: '/WxAppApi/sendTemplate',
      data: {
        rd_session: app.rd_session,
        form_id: formId,
        data: templateData,
      },
      success: success,   // errorcode==0时发送成功
      fail: fail
    });
  },
  // 调用微信支付接口
  wxPay: function (para) {
    var _this = this;
    _this.ajax(_this.ceport.build_payparam, { order_no: para.orderno, openid: para.openid }, function (res) {
      var param = res.data;
      wx.requestPayment({
        'timeStamp': param.timeStamp,
        'nonceStr': param.nonceStr,
        'package': param.package,
        'signType': 'MD5',
        'paySign': param.paySign,
        success: function (res) {
          typeof para.success === 'function' && para.success(res);
        },
        fail: function (res) {
          typeof para.fail === 'function' && para.fail(res);
        }
      })

    });
  },
  wxPay1: function (para) {
    var _this = this;
    _this.ajax(_this.ceport.build_recharge_payparam, { order_no: para.orderno, openid: para.openid }, function (res) {
      var param = res.data;
      wx.requestPayment({
        'timeStamp': param.timeStamp,
        'nonceStr': param.nonceStr,
        'package': param.package,
        'signType': 'MD5',
        'paySign': param.paySign,
        success: function (res) {
          typeof para.success === 'function' && para.success(res);
        },
        fail: function (res) {
          typeof para.fail === 'function' && para.fail(res);
        }
      })

    });
  },
  wxPay2: function (para) {
    var _this = this;
    _this.ajax(_this.ceport.build_payorderparam, { order_no: para.orderno, openid: para.openid }, function (res) {
      var param = res.data;
      wx.requestPayment({
        'timeStamp': param.timeStamp,
        'nonceStr': param.nonceStr,
        'package': param.package,
        'signType': 'MD5',
        'paySign': param.paySign,
        success: function (res) {
          typeof para.success === 'function' && para.success(res);
        },
        fail: function (res) {
          typeof para.fail === 'function' && para.fail(res);
        }
      })

    });
  },
  // check_empty: function (v) {
  //   switch (typeof v) {
  //     case 'undefined':
  //       return true;
  //     case 'string':
  //       if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
  //       break;
  //     case 'boolean':
  //       if (!v) return true;
  //       break;
  //     case 'number':
  //       if (0 === v || isNaN(v)) return true;
  //       break;
  //     case 'object':
  //       if (null === v || v.length === 0) return true;
  //       for (var i in v) {
  //         return false;
  //       }
  //     default:
  //       return true;
  //   }
  //   return false;
  // },
  sendTemplate: function (formId, templateData, success, fail) {
    var app = getApp();
    this.getJSON({
      url: '/WxAppApi/sendTemplate',
      data: {
        rd_session: app.rd_session,
        form_id: formId,
        data: templateData,
      },
      success: success,   // errorcode==0时发送成功
      fail: fail
    });
  },
  //封装获取数据的方式
  ajax: function (url, data, fun, funce, post) {
    //var appkey = wx.getStorageSync('appkey');
    data.mchid = 'd072f71878ca8a3288b05bb50c0ecc65';
    var method = "POST";
    var header = {
      'content-type': 'application/json'
    };
    //获取数据
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        if (res.data.result == 'success') {
          var data = {
            errcode: '0',
            data: res.data
          }
          fun(data);
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {
              funce();
            }
          })
        }
      }
    });
  },
  //测试接口
  ceport: {
    // 登录
    login: config.BASE_URL + "Api/wxlogin",
    check_login: config.BASE_URL + "Api/check_login",
    payment: config.BASE_URL + "Api/get_order_payinfo",
    build_payparam: config.BASE_URL + "/WePay/build_payparam",
    build_recharge_payparam: config.BASE_URL + "/WePay/build_recharge_payparam",
    build_payorderparam: config.BASE_URL + "/WePay/build_payorderparam",
    //商品评价
    good_comment: config.BASE_URL + 'Api/good_comment',
    // 注册
    register: config.BASE_URL + 'Api/user/wxapp/register/complex',
    template: config.BASE_URL + 'Api/template-msg/put',
    // banner图
    banners: config.BASE_URL + 'Api/banner',
    // 商品类别
    category: config.BASE_URL + 'Api/category_list',
    // 商品
    good_list: config.BASE_URL + 'Api/good_list',
    //获取商品带规格的价格
    get_good_price: config.BASE_URL + 'Api/get_sku',
    submit_order: config.BASE_URL + 'Api/submit_order',
    // 折扣优惠券
    coupons: config.BASE_URL + 'Api/coupon_list',
    // 获取优惠券
    fetch: config.BASE_URL + 'Api/get_coupon',
    //公告列表
    notice: config.BASE_URL + 'Api/news_list',
    // 绑定手机号码
    bindMobile: config.BASE_URL + 'Api/bind_phone',
    category_detail: config.BASE_URL + 'Api/category_detail',
    // 我的优惠券
    discounts: config.BASE_URL + 'Api/discounts/my',
    // 公告详情
    notice_detail: config.BASE_URL + 'Api/news_detail',
    // 订单详情
    order_detail: config.BASE_URL + 'Api/order_detail',
    // 订单支付
    orde_delivery: config.BASE_URL + 'Api/order/delivery',
    // 订单信誉
    order_reputation: config.BASE_URL + 'Api/reputation',
    // 关闭订单
    cancel_order: config.BASE_URL + 'Api/cancel_order',
    // 商品详情
    good_detail: config.BASE_URL + 'Api/good_detail',
    // 添加地址
    address: config.BASE_URL + 'Api/add_address',
    // 
    address2: config.BASE_URL + 'Api/address_list',
    // 
    address_list: config.BASE_URL + 'Api/address_list',
    // 
    delete_address: config.BASE_URL + 'Api/delete_address',
    order_list: config.BASE_URL + 'Api/order_list',
    set_default_address: config.BASE_URL + 'Api/set_default_address',
    get_address_info: config.BASE_URL + 'Api/get_address_info',
    get_default_address: config.BASE_URL + 'Api/get_default_address',
    edit_address: config.BASE_URL + 'Api/edit_address',
    member_coupon: config.BASE_URL + 'Api/member_coupon',
    cart_list: config.BASE_URL + 'Api/cart_list',
    get_order_info: config.BASE_URL + 'Api/get_order_info',
    add_cart: config.BASE_URL + 'Api/add_cart',
    select_cart: config.BASE_URL + 'Api/select_cart',
    submit_cart_order: config.BASE_URL + 'Api/submit_cart_order',
    index: config.BASE_URL + 'Api/index',
    contact: config.BASE_URL + 'Api/contact',
    good_index: config.BASE_URL + 'Api/good_index',
    delete_cart: config.BASE_URL + 'Api/delete_cart',
    update_cartnum: config.BASE_URL + 'Api/update_cartnum',
    content_list: config.BASE_URL + 'Api/content_list',
    content_detail: config.BASE_URL + 'Api/content_detail',
    receive_order: config.BASE_URL + 'Api/receive_order',
    // 城市
    mendian_category: config.BASE_URL + 'Api/mendian_category',
    mendian_list: config.BASE_URL + 'Api/mendian_list',
    mendian_detail: config.BASE_URL + 'Api/mendian_detail',
    update_password: config.BASE_URL + 'Api/update_password',
    check_coupon: config.BASE_URL + 'Api/check_coupon',
    applay_recharge: config.BASE_URL + 'Api/applay_recharge',
    good_list_jifen: config.BASE_URL + 'Api/good_list_jifen',
    get_good_jifen: config.BASE_URL + 'Api/get_good_jifen',
    order_list_jifen: config.BASE_URL + 'Api/order_list_jifen',
    mendian_list: config.BASE_URL + 'Api/mendian_list',
    recharge_record: config.BASE_URL + 'Api/recharge_record',
    cash_record: config.BASE_URL + 'Api/cash_record',
    point_record: config.BASE_URL + 'Api/point_record',
    category_list: config.BASE_URL + 'Api/category_list',
    recharge_card: config.BASE_URL + 'Api/recharge_card',
    applay_recharge_card: config.BASE_URL + 'Api/applay_recharge_card',
    edit_pass: config.BASE_URL + 'Api/edit_pass',
    check_pass: config.BASE_URL + 'Api/check_pass',
    about_jifen: config.BASE_URL + 'Api/about_jifen',
    member_info: config.BASE_URL + 'Api/member_info',
    send_template_message_staff: config.BASE_URL + 'Api/send_template_message_staff',
    express_info: config.BASE_URL + 'Api/express_info',
  },
  globalData: {
    userInfo: null,
    subDomain: "mall",
    version: "1.7",
    shareProfile: '百款精品商品，总有一款适合您', // 首页转发的时候话术
    shop_name: "八马茶业—陕西"
  }
  // 根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒
})











