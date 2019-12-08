 var commonCityData = require('../../utils/city.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0,
    idd:''
  },
  bindCancel: function () {
    wx.navigateBack({})
  },
  bindSave: function (e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;
    var rd_session = wx.getStorageSync('rd_session');
    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (this.data.selProvince == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (this.data.selCity == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    // 省
    var selProvincename = commonCityData.cityData[this.data.selProvinceIndex].name
    // 市
    var cityname = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].name;
    // 区
    var districtname;
    if (this.data.selDistrict == "请选择" || !this.data.selDistrict) {
      districtname = '';
    } else {
      districtname = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].name;
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }
    var apiAddoRuPDATE = "add";
    var apiAddid = that.data.id;
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = 0;
    }

    app.ajax(app.ceport.edit_address, {
      rd_session: rd_session,
      province: selProvincename,//省
      city: cityname,
      county: districtname,
      name: linkMan,//名
      phone: mobile,//电话,
      address: address,//地址
      address_id:that.data.idd
    }, function (res) {
      wx.navigateBack({})
    });
  },

  initCityData: function (level, obj) {
    if (level == 1) {
      var pinkArray = [];
      for (var i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces: pinkArray
      });
    } else if (level == 2) {
      var pinkArray = [];
      var dataArray = obj.cityList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys: pinkArray
      });
    } else if (level == 3) {
      var pinkArray = [];
      var dataArray = obj.districtList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      });
    }

  },
  bindPickerProvinceChange: function (event) {
    var selIterm = commonCityData.cityData[event.detail.value];
    console.log(selIterm)
    this.setData({
      selProvince: selIterm.name,
      selProvinceIndex: event.detail.value,
      selCity: '请选择',
      selCityIndex: 0,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(2, selIterm)
  },
  bindPickerCityChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity: selIterm.name,
      selCityIndex: event.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  onLoad: function (e) {
    var that = this;
    this.initCityData(1);
    var id = e.id;
    that.setData({
      idd: e.id
    })
    if (id) {
      // 初始化原数据
     // wx.showLoading();
      // wx.request({
      //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/detail',
      //   data: {
      //     token: app.globalData.token,
      //     id: id
      //   },
      //   success: function (res) {
      //     wx.hideLoading();
      //     if (res.data.code == 0) {
      //       that.setData({
      //         id: id,
      //         addressData: res.data.data,
      //         selProvince: res.data.data.provinceStr,
      //         selCity: res.data.data.cityStr,
      //         selDistrict: res.data.data.areaStr
      //       });
      //       that.setDBSaveAddressId(res.data.data);
      //       return;
      //     } else {
      //       wx.showModal({
      //         title: '提示',
      //         content: '无法获取快递地址数据',
      //         showCancel: false
      //       })
      //     }
      //   }
      // })
      var rd_session = wx.getStorageSync('rd_session');
      app.ajax(app.ceport.get_address_info, { rd_session: rd_session, address_id:id }, function (res) {
        that.setData({
              addressData: res.data,
              selProvince: res.data.province,
              selCity: res.data.city,
              selDistrict: res.data.county,
        });
        // var clist = commonCityData.cityData
        // for (var i = 0; i < clist.length; i++) {
        //   if (clist[i].name == that.data.selProvince) {
        //     that.setData({
        //       selProvinceIndex: i
        //     });
        //     var cclist = clist[i].cityList
        //     for (var j = 0; j < cclist.length; j++) {
        //       if (cclist[j].name == that.data.selCity) {
        //         that.setData({
        //           selCityIndex: j
        //         });
        //         var ccclist = cclist[j].districtList
        //         for (var x = 0; x < ccclist.length; x++) {
        //           if (ccclist[x].name == that.data.selDistrict) {
        //             that.setData({
        //               selDistrictIndex: x
        //             });
        //           }
        //         }
        //       }
        //     }
        //   }
        // } 
      });
    }
  },
  setDBSaveAddressId: function (data) {
    var retSelIdx = 0;
    for (var i = 0; i < commonCityData.cityData.length; i++) {
      if (data.provinceId == commonCityData.cityData[i].id) {
        this.data.selProvinceIndex = i;
        for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
          if (data.cityId == commonCityData.cityData[i].cityList[j].id) {
            this.data.selCityIndex = j;
            for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
              if (data.districtId == commonCityData.cityData[i].cityList[j].districtList[k].id) {
                this.data.selDistrictIndex = k;
              }
            }
          }
        }
      }
    }
  },
  selectCity: function () {

  },
  // deleteAddress: function (e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   var rd_session = wx.getStorageSync('rd_session');
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定要删除该收货地址吗？',
  //     success: function (res) {
  //       if (res.confirm) {

  //         app.ajax(app.ceport.delete_address, { rd_session: rd_session, address_id:that.data.idd}, function (res) {
  //           wx.navigateBack({})
  //         });

  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // }
})
