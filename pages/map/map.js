// pages/map/map.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subKey:'EHPBZ-FSPCU-CZZVY-GUKE4-VZE2K-DDF5C',
    longitude:'120.38852',
    latitude:'30.308794',
    showDialog:false,
    currentmarker:null,
    navi_url:null,
    marker:[],
    showLocation:true,
    enablebuilding:true
  },

  handleMarkerTap(e){
    console.log(this.data);
    const markers=this.data.marker.find(item=>item.id == e.markerId);
    markers && this.setData({
      currentmarker:markers,
      showDialog:true,
      navi_url:markers.urll
    })
  },

  navi1(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/pic/pic?id='+e.currentTarget.dataset.id,
    })
  },

  // navi2(e){
  //   wx.navigateTo({
  //     url: '/pages/signin/signin?id='+e.currentTarget.dataset.id,
  //     acceptData(res){
  //       console.log(res.data)
  //     },
  //     success:(e)=>{
  //       e.eventChannel.emit('acceptDataFromOpenerPage',{data:this.data.currentmarker})
  //     }
      
  //   })
  // },
  navi2(e) {
    const id = e.currentTarget.dataset.id;
    console.log(id);
    let targetUrl;
    if (id === 1) {
        targetUrl = '/pages/bookindex/bookindex';
    } else if (id === 2) {
        targetUrl = '/pages/bookbadminton/bookbadminton';
    }

    if (targetUrl) {
        wx.navigateTo({
            url: targetUrl,
        });
    }
    // wx.getLocation({
    //     type: 'gcj02', // 使用 gcj02 坐标系
    //     success: (res) => {
    //         // 获取用户的真实位置
    //         const latitude = res.latitude;
    //         const longitude = res.longitude;

    //         wx.navigateTo({
    //             url: '/pages/signin/signin?id=' + e.currentTarget.dataset.id, // 保持传递 marker 的 id
    //             success: (navigateEvent) => {
    //                 // 将当前 marker 信息和用户位置传递给签到页面
    //                 navigateEvent.eventChannel.emit('acceptDataFromOpenerPage', {
    //                     currentmarker: this.data.currentmarker, // 传递当前 marker 信息
    //                     latitude: latitude, // 用户当前位置
    //                     longitude: longitude // 用户当前位置
    //                 });
    //             }
    //         });
    //     },
    //     fail: (err) => {
    //         console.error('获取位置信息失败:', err);
    //         wx.showToast({
    //             title: '获取位置失败，请检查权限',
    //             icon: 'none'
    //         });
    //     }
    // });

},

  
  

  getmarker(){
    db.collection('markers')
    .get({
      success:(res)=>{
        console.log(res)
        this.setData({
          marker:res.data
        })
        console.log(this.data.marker)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('初始',this.data)
    wx.getLocation({
      success:(res)=>{
        console.log(res),
        this.setData({
          // latitude:res.latitude,
          // longitude:res.longitude
        })
        // this.data.latitude=res.latitude,
        // this.data.longitude=res.longitude
      }
    })

    this.getmarker()
    
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

