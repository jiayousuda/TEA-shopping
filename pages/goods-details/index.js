//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {},
    swiperCurrent: 0,


    hasMoreSelect: false,
    selectSize: "选择：",
    selectSizePrice: 0,
    total_num: 0,//购物车总数量
    hideShopPopup: true,
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: 0,
    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
    sku_id:0,


    imgwidth3: 0,
    imgheight3: 0,
    screenHeight: 0,
    screenWidth: 0,
  },
  //轮播图事件处理函数
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
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
  // onload
  onLoad: function (e) {
    
    if (e.inviter_id) {
      wx.setStorage({
        key: 'inviter_id_' + e.goid,
        data: e.inviter_id
      })
    }
   
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    }); 
    that.setData({
      goid: e.goid
    });
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        if (res.data.shopList.length >= 1) {
          let t = 0;
          for (var i = 0; i < res.data.shopList.length; i++) {
            t += res.data.shopList[i].total_num;
          }
          that.setData({
            shopCarInfo: res.data,
            total_num: t
          });
        }
      }
    })
    app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
      that.setData({
        total_num: res.data.data.total_num
      });
     
    })

    // 获取商品详情
    app.ajax(app.ceport.good_detail, { good_id: e.goid}, function (res) {
      var selectSizeTemp = "";
      // res.data.data.properties商品属性
      if (res.data.data.spec_list.length >= 1) {
        for (var i = 0; i < res.data.data.spec_list.length; i++) {
          selectSizeTemp = selectSizeTemp + " " + res.data.data.spec_list[i].name;
        }
        that.setData({
          hasMoreSelect: true,//有商品属性就显示selectSize
          selectSize: that.data.selectSize + selectSizeTemp,
          selectSizePrice: res.data.data.sell_price,//商品价格
          hasMoreSelect: true,
          comment_list: res.data.data.comment_list,
          reputation: res.data.data.comment_list.length>0?true:false
        });
      } else {
        that.setData({
          hasMoreSelect: false
        });
      }
      that.data.goodsDetail = res.data.data;
      console.log(that.data.goodsDetail);
      that.setData({
        goodsDetail: res.data.data,//商品详情
        selectSizePrice: res.data.data.good_info.sell_price,//商品价格
        buyNumMax: 5,//最大购买数量
        buyNumber: (5 > 0) ? 1 : 0//最小购买数量
      });
      WxParse.wxParse('article', 'html', res.data.data.good_info.content, that, 5);//商品介绍
    });
  },
  

  //加入购物车
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '暂时缺货哦~',
        showCancel: false
      })
      return;
    }
  },
  // 规格选择弹出框
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  //  规格选择弹出框隐藏
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  // 立即购买
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    if (this.data.goodsDetail.spec_list && !this.data.canSubmit) {
      this.bindGuiGeTap();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '暂时缺货哦~',
        showCancel: false
      })
      return;
    }
    this.addShopCar();
    this.goShopCar();
  },
  //跳转到购物车
  goShopCar: function () {
    wx.navigateTo({
      url: "/pages/shop-cart/index"
    });
  },
  // 购物车里面的 加入购物车
  addShopCar: function () {
    var that = this;
    if (this.data.goodsDetail.spec_list.length >= 1 && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();//规格选择弹出框
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //加入购物车
    app.ajax(app.ceport.add_cart, {
      good_id: this.data.goodsDetail.good_info.id, total_num: that.data.buyNumber, sku_id: that.data.sku_id, rd_session: wx.getStorageSync('rd_session')
    }, function (res) {
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
     
      app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
        that.setData({
          total_num: res.data.data.total_num
        });

      })
      //  规格选择弹出框隐藏
      that.closePopupTap();
    })
  },

  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  //  选择商品规格
  labelItemTap: function (e) {
    var that = this;
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.spec_list[e.currentTarget.dataset.propertyindex].value_list;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.spec_list[e.currentTarget.dataset.propertyindex].value_list[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.spec_list[e.currentTarget.dataset.propertyindex].value_list[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.spec_list.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < that.data.goodsDetail.spec_list.length; i++) {
      childs = that.data.goodsDetail.spec_list[i].value_list;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + childs[j].id + ",";

          propertyChildNames = propertyChildNames + that.data.goodsDetail.spec_list[i].name + ":" + childs[j].attr_value + "  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      app.ajax(app.ceport.get_good_price, {
        good_id: that.data.goodsDetail.good_info.id,
        rd_session: wx.getStorageSync('rd_session'),
        sku_ids: propertyChildIds.substr(0, propertyChildIds.length - 1)
      }, function (res) {
        that.setData({
          selectSizePrice: res.data.price,
          propertyChildIds: propertyChildIds.substr(0, propertyChildIds.length - 1),
          propertyChildNames: propertyChildNames,
          buyNumMax: res.data.data.stock,
          buyNumber: (res.data.data.stock > 0) ? 1 : 0,
          sku_id: res.data.data.id,
          sku_str: res.data.data.attr_str_value,
        });

      });
    }
    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit
    })
  },
  //  立即购买
  buyNow: function () {
    var that = this
    if (this.data.goodsDetail.spec_list.length >= 1 && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      wx.showModal({
        title: '提示',
        content: '请先选择规格尺寸哦~',
        showCancel: false
      })
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow&good_id=" + that.data.goodsDetail.good_info.id + "&total_num=" + that.data.buyNumber + "&sku_id=" + that.data.sku_id
    })
  },

	/**
	 * 组建立即购买信息
	 */
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    shopCarMap.good_id = this.data.goodsDetail.id;
    shopCarMap.good_image = this.data.goodsDetail.good_image;
    shopCarMap.goods_name = this.data.goodsDetail.goods_name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.sell_price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.total_num = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.total_num) {
      buyNowInfo.total_num = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },

  //分享设置
  onShareAppMessage: function () {
    var that=this
    return {
      title: "",
      path: '/pages/goods-details/index?goid=' + this.data.goid ,
      success: function (res) {
        console.log(that.data.goid )
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  fen: function () {
    var good_id = this.data.goodsDetail.good_info.id
    var good_image = this.data.goodsDetail.good_info.good_image
    var goods_name = this.data.goodsDetail.good_info.goods_name
    var sell_price = this.data.goodsDetail.good_info.sell_price
    console.log(good_id)
    wx.navigateTo({
      url: '/pages/endorsement/endorsement?good_id=' + good_id + "&good_image=" + good_image + "&goods_name=" + goods_name + "&sell_price=" + sell_price,
    })
   


  },
  home: function () {
    wx.switchTab({
      url: '/pages/index1/index1',
    })
  },
  

})
