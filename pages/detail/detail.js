// pages/detail/detail.js

const util = require('../../utils/util')
const app = getApp()
const urlList = require("../../utils/api.js")  // 根据实际项目自己配置
 
// 实例化API核心类
const qqmapsdk = app.globalData.qqmapsdk

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    latitude:'',
    longitude:'',
    distance:'',
    detail:{},
    isshoucang:false,
    index:null,
    src:'http://www.hzic.edu.cn/'
  },

    copyText: function () {
      wx.setClipboardData({
        data: this.data.src,
        success: function () {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
  

  shoucang(res){
    var that=this
    var isshoucang=!that.data.isshoucang
    that.setData({
      isshoucang,
    })
    wx.showToast({
      title: isshoucang?'收藏成功':'取消收藏',
    })

    console.log('id:',that.data.index)
    //点击收藏图标后缓存数据到本地
    //把data中的index放到新let出来的index中,因为下面要把index也存进去,要用index来判断你收藏了哪个页面 
    //首先去看一下缓存的数据
    wx.getStorage({
      key:'isshoucang',
      success:(res)=>{
        let obj = res.data;
        //如果有,则刷新,没有则追加
        obj[that.data.index] = isshoucang;
        console.log('obj',obj)
        wx.setStorage({
          key: 'isshoucang',
          data: obj,
          success: () => {
            console.log('set')
          }
        });
      }
    })


  },

  daka(){
    wx.navigateTo({
      url: '/pages/map/map',
    })
  },

  
  Rad(d) { 
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },  

  getDistance() {
    var that=this
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    var radLat1 = this.Rad(that.data.latitude);
    var radLat2 = this.Rad(that.data.list.latitude);
    var a = radLat1 - radLat2;
    var b = this.Rad(that.data.longitude) - this.Rad(that.data.list.longitude);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(1) //保留两位小数
    that.setData({
      distance:s
    })
},

  getAddress(e) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      success: function(res) {
        console.log('res',res)
          that.setData({
            latitude:res.result.location.lat,
            longitude:res.result.location.lng
        });
        that.getDistance()
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },

  getshoucang(e){
    var that=this
    let detailstroage=wx.getStorageSync('isshoucang')
    console.log('detail',detailstroage[that.data.index])
    if(!detailstroage)
    {
      wx.setStorageSync('isshoucang', {})
    }
    if(detailstroage[that.data.index]){
      that.setData({
        isshoucang:true
      })
    }
    console.log('like',that.data)
    //本地缓存
    // if(that.data.isshoucang)
    // {
    //   wx.setStorageSync('like', that.data.list.id)
    //   console.log('yes')
    // }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    const eventChannel=that.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage',(data)=>{
      that.setData({
        list:data.data
      })
    })
    console.log(that.data.list)
    that.getAddress()
    that.setData({
      index:options.id
    })
    that.getshoucang()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})