// pages/me/me.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

const app=getApp()
let price=0
let m=''

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
      avatar:defaultAvatarUrl,
      nickName:'null',
      issignin:false,
  },

  getdata(){
    if(app.globalData.userInfo.nickName==='')
    {
      console.log("空的")
      console.log(this.data)
    }
    else{
      this.setData({
        nickName:app.globalData.userInfo.nickName,
        avatar:app.globalData.userInfo.avatarUrl
      })
    }
  },

  navi(){
    wx.navigateTo({
      url: '/pages/rank/rank',
      success:(res)=>{
        wx.setNavigationBarTitle({
          title: '校园网红榜',
        })
      }
    })
  },

  navi2(){
    wx.navigateTo({
      url: '/pages/like/like',
      success:(res)=>{
        wx.setNavigationBarTitle({
          title: '收藏',
        })
      }
    })
  },

  navi3(){
    wx.navigateTo({
      url: '/pages/buy/buy',
      success:(res)=>{
        wx.setNavigationBarTitle({
          title: '藏品记录',
        })
      }
    })
  },

  navi4(){
    wx.navigateTo({
      url: '/pages/control/control',
      success:(res)=>{
        wx.setNavigationBarTitle({
          title: '藏品管理',
        })
      }
    })
  },

  // getprice(){
  //   if(this.data.nickName!='null'){
  //       wx.cloud.database().collection('user').where({
  //           _id:this.data.nickName
  //       }).get()
  //       .then(res=>{
  //           price=res.data[0].price
  //           m=res.data[0].chain
  //           this.setData({
  //               money:price,
  //               chain:m
  //           })
  //       })
  //   }
  // },

  signin(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData)
    var that=this
    var ava=wx.getStorageSync('avatar')
    var nic=wx.getStorageSync('name')
    var is=wx.getStorageSync('issign')
    if(is){
      app.globalData.issign=true
    }
    if(app.globalData.issign)
    {
      that.setData({
        nickName:nic,
        avatar:ava,
        issignin:is
      })
      app.globalData.userInfo.nickName=nic
      app.globalData.userInfo.avatarUrl=ava
    }
    else{
      that.getdata()
      if(app.globalData.issign){
        that.setData({
          nickName:app.globalData.userInfo.nickName,
          avatar:app.globalData.userInfo.avatarUrl,
          issignin:app.globalData.issign
        })
      }
    }
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