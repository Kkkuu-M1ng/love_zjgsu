const { submitCheckInInfo } = require("../../utils/api")
const db=wx.cloud.database()
// pages/like/like.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeid:[],
    list:[]
  },

  

  getdata(){
    var id=wx.getStorageSync('isshoucang')
    console.log('id:',id)
    this.setData({
      likeid:id
    })
    for(var i=0;i<9;i++){
      if(this.data.likeid[i]){
        db.collection('markers')
        .where({
          id:i+1
        })
        .get({
          success:(res)=>{
            this.setData({
              list:this.data.list.concat(res.data)
            })
            console.log(res.data)
          }
       })
      }
    }
    // for(var i=0;i<sum;i++){
    //   if(id[i])
    // }
  },

  // getlength(){
  //   console.log(this.data.likeid.length)
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    this.getdata()
  
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