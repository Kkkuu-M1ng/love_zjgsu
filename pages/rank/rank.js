// pages/rank/rank.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    // list:[
    //   {
    //     id:1,
    //     lat:'30.159759',
    //     lon:'120.1021384',
    //     name:'杭州博物馆之江馆区',
    //     position:'西湖区',
    //     detail:'浙江省博物馆之江馆区，位于浙江省之江文化中心，是首批被确定的国家一级博物馆和中央地方共建国家级博物馆。',
    //     url:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/之江.jpg',
    //     num:5,
    //     one:5,
    //     two:0,
    //     ui:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/杭州博物馆.png',
    //     url2:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/之江馆.jpg'
    //   },
    //   {
    //     id:2,
    //     lat:'30.2514419',
    //     lon:'120.1439165',
    //     name:'杭州博物馆孤山馆区',
    //     position:'西湖区',
    //     detail:'浙江博物馆孤山馆区：坐拥西湖美景，还有江南仅存皇家藏书楼。',
    //     url:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/孤山.jpg',
    //     num:5,
    //     one:5,
    //     two:0,
    //     ui:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/杭州博物馆.png',
    //     url2:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/孤山馆.jpg'
    //   },
    //   {
    //     id:3,
    //     lat:'30.277559',
    //     lon:'120.1622038',
    //     name:'杭州博物馆武林馆区',
    //     position:'西湖区',
    //     url:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/武林.jpg',
    //     detail:'武林馆区位于运河边的西湖文化广场，浙博十大镇馆之宝中，有七件都在武林馆里。',
    //     num:4,
    //     one:4,
    //     two:1,
    //     ui:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/杭州博物馆.png',
    //     url2:'cloud://yp-6g773pfw08e78829.7970-yp-6g773pfw08e78829-1314704929/博物馆/武林馆.jpg'
    //   }
    // ],
  },

  navi(e){
    var id=e.currentTarget.dataset.id-1
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
      acceptData(res){
        console.log(res.data)
      },
      success:(e)=>{
        e.eventChannel.emit('acceptDataFromOpenerPage',{data:this.data.lists[id]})
      }
    })
  },

  getdata(e){
    db.collection('markers')
    // .aggregate()
    // .sort({'num':-1})
    .get({
      success:(res)=>{
        this.setData({
          lists:res.data
        })
        console.log(this.data.lists)
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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