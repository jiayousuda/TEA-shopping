var  app = getApp()
Page({
  data: {
    saveHidden: true,
    totalPrice: 0,
    allSelect: true,
    noSelect: false,
    list: [],
    c: false,
    delBtnWidth: 120,    //删除按钮宽度单位（rpx）
  },
  onLoad: function () {
    this.onShow();
  },
  onShow: function () {
    var that = this;
    app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
      console.log(res);
      that.setData({
        c: res.data.data.check_all,
        list: res.data.data.list,
        totalPrice: res.data.data.total_fee
      });
      if (res.data.data.total_fee==null){
        that.setData({
          totalPrice:0
        });
      }
      if (res.data.data.list.length > 0) {
        that.setData({
          hidde: true
        })
      }
    })
  },
  // 去逛逛
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index1/index1"
    });
  },
  // 单选
  selectTap: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var isCheck = e.currentTarget.dataset.check
    var rd_session = wx.getStorageSync('rd_session');
    console.log(index)
    console.log(id)
    console.log(isCheck)
    var list = this.data.list;
    if (index !== "" && index != null) {
      app.ajax(app.ceport.select_cart, { id: id, is_check: isCheck, rd_session: rd_session }, function (res) {
        app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
          that.setData({
            list: res.data.data.list,
            c: res.data.data.check_all,
            totalPrice: res.data.data.total_fee
          });
          if (res.data.data.total_fee == null) {
            that.setData({
              totalPrice: 0
            });
          }
        })
      })
    }
  },
  // 全选
  bindAllSelect: function (e) {
    var that = this;
    var isCheck = e.target.dataset.check
    var id = e.target.dataset.id
    var rd_session = wx.getStorageSync('rd_session');
    app.ajax(app.ceport.select_cart, { is_check: isCheck, id: id, rd_session: rd_session }, function (res) {
      app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
        console.log(res);
        that.setData({
          list: res.data.data.list,
          c: res.data.data.check_all,
          totalPrice: res.data.data.total_fee,
        });
        if (res.data.data.total_fee == null) {
          that.setData({
            totalPrice: 0
          });
        }
      })
    })
  },
  // 加
  jiaBtnTap: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var types = e.currentTarget.dataset.types;
    console.log(id);
    console.log(types);
    app.ajax(app.ceport.update_cartnum, { types: types, rd_session: wx.getStorageSync('rd_session'), id: id }, function (res) {
      app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
        console.log(res);
        that.setData({
          list: res.data.data.list,
          totalPrice: res.data.data.total_fee,
        });
        if (res.data.data.total_fee == null) {
          that.setData({
            totalPrice: 0
          });
        }
      })
    })
  },
  // 减
  jianBtnTap: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var types = e.currentTarget.dataset.types;
    app.ajax(app.ceport.update_cartnum, { types: types, rd_session: wx.getStorageSync('rd_session'), id: id }, function (res) {
      app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
        console.log(res);
        that.setData({
          list: res.data.data.list,
          totalPrice: res.data.data.total_fee,
        });
        if (res.data.data.total_fee == null) {
          that.setData({
            totalPrice: 0
          });
        }
      })
    })
  },
  // 编辑
  editTap: function () {
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setData({ saveHidden: false, })
  },
  // 完成
  saveTap: function () {
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setData({ saveHidden: true, })
  },
  // 删除
  deleteSelected: function () {
    var that=this
    var list = this.data.list;
    var checkid = ''
    for (var i = 0; i < list.length; i++) {
      if (list[i].is_check == true) {
        checkid = checkid + list[i].id + ','
      }
    }
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          app.ajax(app.ceport.delete_cart, { ids: checkid, rd_session: wx.getStorageSync('rd_session') }, function (res) {
            app.ajax(app.ceport.cart_list, { rd_session: wx.getStorageSync('rd_session') }, function (res) {
              console.log(res.data.data.total_num)
              that.setData({
                list: res.data.data.list,
                totalPrice: res.data.data.total_fee,
              });
              if (res.data.data.total_fee == null) {
                that.setData({
                  totalPrice: 0
                });
              }
              console.log(res.data.data.list)
              if (res.data.data.total_num == 0) {
                that.setData({
                  hidde: false
                })
                console.log(that.data.hidde)
              }
            })
           
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //去结算
  toPayOrder: function () {
    wx.navigateTo({
      url: '/pages/to-pay-order/index',
    })
  },
})
