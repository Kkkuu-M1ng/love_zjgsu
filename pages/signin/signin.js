// location_check_in/location_check_in.js
const util = require('../../utils/util')
const app = getApp()
const urlList = require("../../utils/api.js")  // 根据实际项目自己配置
const db=wx.cloud.database()
// 实例化API核心类
const qqmapsdk = app.globalData.qqmapsdk
 
Page({
 
  /**
   * 页面的初始数据
   */
  data: {

    marker:[],
    markers:[],
    poi: {
      latitude: '',
      longitude: ''
    },
    addressName: '',
    time: '',
    timer: '',
    timer2: '',  // 用来每个一段时间自动刷新一次定位
    canClick: true,
    userName:'',
    userGender:'',
    qiandao:'签到',
    id:''
  },
 
  getmarker(){
    let id='_'+this.data.id
    console.log(id)
    db.collection('markers')
    .where({
      markerId:id
    })
    .get({
      success:(res)=>{
        console.log(res)
        this.setData({
          markers:res.data
        })
        console.log(this.data.markers)
      }
    })
  },
  
  getinfomation(res){
    wx.getUserProfile({
      desc: '获取用户信息',
      success:(res)=>{
        this.setData({
          userName:res.userInfo.nickName,
          userInfo:res.userInfo
        })
      }
    })
  },

  navi2(e){
    wx.navigateTo({
      url: '/pages/photo/photo',
    })
  },

  // getAddress(e) {
  //   var that = this;
  //   qqmapsdk.reverseGeocoder({
  //     //位置坐标，默认获取当前位置，非必须参数
  //     /**
  //      * 
  //       location: {
  //         latitude: 39.984060,
  //         longitude: 116.307520
  //       },
  //     */
  //     // 成功后的回调
  //     success: function(res) {
  //       that.setData({
  //         addressName: res.result.address
  //       })
  //       var res = res.result;
  //     //  that.data.marker.latitude=parseFloat(that.data.marker.latitude)
  //      // that.data.marker.longitude=parseFloat(that.data.marker.longitude)
  //       that.setData({ // 设置markers属性和地图位置poi，将结果在地图展示
  //      //   markers:that.data.markers,
  //         poi: {
  //           latitude:res.location.lat,//30.30878,//
  //           longitude: res.location.lng//120.38852,//
  //         }
  //       });
  //    //   console.log(that.data.markers)
  //     },
  //     fail: function(error) {
  //       console.error(error);
  //     },
  //     complete: function(res) {
  //       console.log(res);
  //     }
  //   })
  // },
  getAddress() {
    var that = this;
  
    wx.authorize({
        scope: 'scope.userLocation',
        success() {
            // 获取当前位置信息
            wx.getLocation({
                type: 'gcj02', // 使用 gcj02 坐标系
                success: function(locationRes) {
                    console.log('设备当前位置:', locationRes.latitude, locationRes.longitude);
                    
                    // 逆地理编码获取详细地址
                    qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: locationRes.latitude,
                            longitude: locationRes.longitude
                        },
                        success: function(res) {
                            that.setData({
                                addressName: res.result.address, // 地址信息
                                poi: {
                                    latitude: locationRes.latitude, // 更新当前位置的纬度
                                    longitude: locationRes.longitude // 更新当前位置的经度
                                }
                            });
                            console.log('更新后的位置信息:', that.data.poi);
                        },
                        fail: function(error) {
                            console.error('逆地理编码失败:', error);
                        }
                    });
                },
                fail: function(error) {
                    console.error('获取当前位置失败:', error);
                }
            });
        },
        fail() {
            // 用户拒绝了位置授权
            wx.showModal({
                title: '授权失败',
                content: '请允许获取您的位置信息以正常使用本功能。',
                showCancel: false
            });
        }
    });
},

  
  getTime: function () {
    let that = this
    let time = that.data.time
    that.setData({
      timer: setInterval(function () {
        time = util.formatTime(new Date())
        that.setData({
          time: time.substr(-8)
        });
        if (time == 0) {
          // 页面跳转后，要把定时器清空掉，免得浪费性能
          clearInterval(that.data.timer)
        }
      }, 1000)
    })
  },
  rePosition: function () {
    console.log('用户点了重新定位')
    this.getAddress()
  },
  checkIn: function () {
    console.log('用户点击了签到')
    var that = this
    var dis=that.getDistance(that.data.markers[0].latitude,that.data.markers[0].longitude,that.data.poi.latitude,that.data.poi.longitude)
    console.log('dis:',dis)
    var nowTime = util.formatTime(new Date())
    wx.showModal({
      title: '请确认打卡信息',
      // content: '请确认待整改项已整改完毕！',
      content: `地点：${this.data.addressName}\n时间：${nowTime}`,  // 开发者工具上没有换行，真机调试时会有的
      confirmText: '确认',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if(dis<3){
            // 调起签到接口
            that.realyCheckIn()
          }
          else{
            that.falseCheckIn()
          }
          
          
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.setData({
            canClick: true
          })
        }
      }
    })
    
  },
  realyCheckIn: function() {
    var that = this
    that.setData({
      qiandao:'已签到',
      canClick:false
    })
    let obj = {}
    obj[that.data.id] = this.data.canClick
    console.log(obj)
    wx.setStorageSync('canClick', obj)
  },

  falseCheckIn(){
    wx.showModal({
      title: '提示',
      content: '距离太远啦!',
    })
  },

   Rad(d) { 
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },  

  getDistance(lat1, lng1, lat2, lng2) {
    var that=this
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(1) //保留两位小数
    return s
},

  getPosition(){
    var that=this
    console.log(that.data)
    var dis=that.getDistance(that.data.markers[0].latitude,that.data.markers[0].longitude,that.data.poi.latitude,that.data.poi.longitude)
    wx.showModal({
      title: '提示',
      content: '您离目标打卡地还有'+dis+'km',
    })
  },

  
  getdata(callback){
    var that=this
    let haveClick={}
    wx.getStorage({
      key:'canClick',
      success:(res)=>{
        console.log(res)
        haveClick=res.data
        console.log(haveClick[that.data.id])
    if(haveClick[that.data.id]==false)
    {
      console.log("已经签到！")
      that.setData({
        qiandao:'已签到',
        canClick:false
      })
    }
    console.log(that.data.canClick)
        //如果有,则刷新,没有则追加
        if (typeof callback === 'function') {
          callback();
      }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.id)
    that.setData({
      id:options.id
    })
    
    // let isClick=wx.getStorageSync('canClick')
    // that.setData({
    //   canClick:isClick,
    // })
    // if(!that.data.canClick)
    // {
    //   that.setData({
    //     qiandao:'已签到'
    //   })
    // }
    console.log('can',that.data.canClick)

    const eventChannel=that.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage',(data)=>{
      that.setData({
        markers:data.data
      })
    })
  //  if(Object.keys(that.data.markers).length >0)
      that.getTime()
      that.getAddress()
      that.getdata()
      that.getmarker()
      console.log(that.data.canClick)
      that.setData({
     // canClick: true, // 允许用户点击，防止多次提交
      timer2: setInterval(function () {
        that.getAddress()
      }, 20000)  // 每20秒刷新一次定位
    })
  },
 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer)
    clearInterval(this.data.timer2)
    console.log("定时器已被清除")
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
 
  },
 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
 
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
 
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
 
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
 
  }
})
