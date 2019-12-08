var app = getApp();
Page({
    data:{
      orderId:0,
        goodsList:[],
        yunPrice:"0.00"
    },
    onLoad:function(e){
      var orderId = e.id;
      this.data.orderId = orderId;
      this.setData({
        orderId: orderId
      });
    },
    onShow : function () {
      var that = this;
      // 订单详情
      app.ajax(app.ceport.order_detail, {
        rd_session: wx.getStorageSync('rd_session'),
        id: that.data.orderId}, function (res) {
          wx.hideLoading();
          that.setData({
            orderDetail: res.data
          });
          if (res.data.send_type=="1"){
            that.setData({
              send_type: "配送"
            });
          }else{
            that.setData({
              send_type: "门店自提"
            });
          }
          if (res.data.pay_type == "1") {
            that.setData({
              pay_type: "余额支付"
            });
          } else {
            that.setData({
              pay_type: "微信支付"
            });
          }
      });

      var yunPrice = parseFloat(this.data.yunPrice);
      var allprice = 0;
      var goodsList = this.data.goodsList;
      for (var i = 0; i < goodsList.length; i++) {
        allprice += parseFloat(goodsList[0].sell_price) * goodsList[0].total_num;
      }
      this.setData({
        allGoodsPrice: allprice,
        yunPrice: yunPrice
      });
    },



    
    wuliuDetailsTap:function(e){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/wuliu/index?id=" + orderId
      })
    },
    confirmBtnTap:function(e){
      var that = this;
      var orderId = e.currentTarget.dataset.id;
      wx.showModal({
          title: '确认您已收到商品？',
          content: '',
          success: function(res) {
            if (res.confirm) {
              wx.showLoading();

              // wx.request({
              //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/delivery',
              //   data: {
              //     token: app.globalData.token,
              //     orderId: orderId
              //   },
              //   success: (res) => {
              //     if (res.data.code == 0) {
              //       that.onShow();
              //     }
              //   }
              // })
              //订单支付
              app.ajax(app.ceport.orde_delivery, {
                token: app.globalData.token,
                orderId: orderId}, function (res) {
                  if (res.data.code == 0) {
                    that.onShow();
                  }
              });



            }
          }
      })
    },
    submitReputation: function (e) {
      var that = this;
      var postJsonString = {};
      postJsonString.token = app.globalData.token;
      postJsonString.orderId = this.data.orderId;
      var reputations = [];
      var i = 0;
      while (e.detail.value["orderGoodsId" + i]) {
        var orderGoodsId = e.detail.value["orderGoodsId" + i];
        var goodReputation = e.detail.value["goodReputation" + i];
        var goodReputationRemark = e.detail.value["goodReputationRemark" + i];

        var reputations_json = {};
        reputations_json.id = orderGoodsId;
        reputations_json.reputation = goodReputation;
        reputations_json.remark = goodReputationRemark;

        reputations.push(reputations_json);
        i++;
      }
      postJsonString.reputations = reputations;
      wx.showLoading();

      // wx.request({
      //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/reputation',
      //   data: {
      //     postJsonString: postJsonString
      //   },
      //   success: (res) => {
      //     wx.hideLoading();
      //     if (res.data.code == 0) {
      //       that.onShow();
      //     }
      //   }
      // })
      app.ajax(app.ceport.order_reputation, { postJsonString: postJsonString}, function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.onShow();
        }
      });



    }
})