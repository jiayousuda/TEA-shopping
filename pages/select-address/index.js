//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    app.ajax(app.ceport.set_default_address, { rd_session: wx.getStorageSync('rd_session'), address_id:id }, function (res) {
      wx.navigateBack({})
    });
  },
  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/edit_address/edit_address?id=" + e.currentTarget.dataset.id
    })
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var rd_session = wx.getStorageSync('rd_session');
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {

          app.ajax(app.ceport.delete_address, { rd_session: rd_session, address_id: id}, function (res) {
            that.initShippingAddress();
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  onLoad: function () {
    console.log('onLoad')

   
  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    app.ajax(app.ceport.address_list, { rd_session: wx.getStorageSync('rd_session'), page_size: 6 }, function (res) {
      that.setData({
        coupons: res.data.lists
      });
    });
  }

})
