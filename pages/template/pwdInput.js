function init(){
  let passWord = ''
  let newpassWord=''
  let passWordArr = []
  var that = this

  this.onChangeInput = function (e) {
    
    if (e.detail.value.length >6) {
      return;
    }
    if (e.detail.value.length > that.data.passWord.length) {
      that.data.passWordArr.push(true);
    } else if (e.detail.value.length < that.data.passWord.length) {
      that.data.passWordArr.pop();
    }
     that.setData({
      passWord: e.detail.value,
      passWordArr: that.data.passWordArr
    });
     console.log(e.detail.value)
     console.log(that.data.passWordArr)
  }
  this.onChangeInput1 = function (e) {
    if (e.detail.value.length > 6) {
      return;
    }
    if (e.detail.value.length > that.data.newpassWord.length) {
      that.data.passWordArr.push(true);
    } else if (e.detail.value.length < that.data.newpassWord.length) {
      that.data.passWordArr.pop();
    }
    that.setData({
      newpassWord: e.detail.value,
      passWordArr: that.data.passWordArr
    });
  }
  this.cancel = function(e){
    that.setData({
      isshowpwd:false,
      passWordArr:[],
      passWord:''
    })
  }
  this.cancel1 = function (e) {
    that.setData({
      isshowpwd1: false,
      passWordArr:[],
      passWord: ''
    })
  }
}
module.exports = {
  init: init
};