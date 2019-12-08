var app = getApp(), n = require('../../notice.js');
Page({
  data: {
    navList: [],
    categories:[]
  },
  onLoad: function (options) {
    this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    // wx.showLoading({
    //   title: '加载中...',
    // });
    
    // 商品
    app.ajax(app.ceport.category, {}, function (res) {
      var categories=[]
      for (var i = 0; i < res.data.list.length; i++) {
        categories.push(res.data.list[i]);
      }
      that.setData({
        categories: categories,
      });
    });
  },
  bindlist:function(e){
     var navId = e.currentTarget.dataset.id;
     wx.navigateBack({
       delta:1,
       success:function(){
         var t = { catid: navId};
         n.postNotificationName("getGoodsList", t)
       }
       
     })
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
  
})