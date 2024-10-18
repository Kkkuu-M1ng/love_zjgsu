let currentPage = 0 // 当前第几页,0代表第一页 
let pageSize = 4 //每页显示多少数据

Page({
    data: {
      homedata:[]
    },

    getdata(){
        //云数据请求
        wx.cloud.database().collection('home')
            .skip(currentPage * pageSize)//从第几个数据开始
            .limit(pageSize)
            .get()
            .then(res => {
                console.log('请求成功',res.data)
                currentPage++
                wx.stopPullDownRefresh()
                //把新请求到的数据添加到homedata里 
                this.setData({
                    homedata:this.data.homedata.concat(res.data)
                })
            })
            .catch(err => {
                console.log('请求失败',err)
            })
    },

    detail(e){
        var id = e.currentTarget.dataset.id-1;
        wx.navigateTo({
            url: "../detail-mh/detail-mh?id="+id,
            acceptData(res){
                console.log(res.data)
            },
            success:(e)=>{
                e.eventChannel.emit('acceptDataFromOpenerPage',{data:this.data.homedata[id]})
            }
        })
        wx.showLoading({
            title: '正在加载中'
          })
          wx.request({
              success: ()=>{ },
              complete() {
                setTimeout(() => {
                  wx.hideLoading()
                }, 1000)
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
        currentPage=0,
        wx.stopPullDownRefresh()
        console.log(this.currentPage)
        this.setData({
            homedata:[]
        })
        this.getdata()
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log("上拉触底事件");
        this.getdata()
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
  
    }
  })