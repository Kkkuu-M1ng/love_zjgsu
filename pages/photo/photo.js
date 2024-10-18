// pages/photo/photo.js
const app=getApp()
const db=wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    imgs:[],
    count:3,
    content:'',
    issubmit:false,
    imglist:[],
    avatar:'',
    cloud:''
  },


  upload(res){
    switch(this.data.imgs.length){
      case 0:
        this.data.count=3
        break
      case 1:
        this.data.count=2
        break
      case 2:
        this.data.count=1
        break
    }
    var that=this
    wx.chooseMedia({
      count:that.data.count,
      sizeType: ["original", "compressed"], 
      sourceType: ["album", "camera"],
      success:(res)=>{
        var tempfilepath=res.tempFiles
        for(var i=0;i<that.data.imgs.length;i++)
        tempfilepath.push(that.data.imgs[i])
      //  that.data.imgs.push(tempfilepath)
        that.setData({
          imgs: tempfilepath //res.tempFiles//that.data.imgs
        })
      }
    })

  },  


  deleteimg(e){
    var that = this
    console.log(e)
    console.log(that.data)
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      complete: (res) => {
        if (res.cancel) {
          console.log('取消')
        }
    
        if (res.confirm) {
          console.log('111',res)
          for(var i=0;i<that.data.imgs.length;i++){
            if(i==e.currentTarget.dataset.index)
            that.data.imgs.splice(i,1)
          }
          that.setData({
            imgs:that.data.imgs
          })
          console.log('删除成功')
        }
      }
    })
  },
// up(){
  
//   for(var i=0;i<this.data.imgs.length;i++){
//     wx.cloud.uploadFile({
//       cloudPath:'upload/'+Date.parse(new Date())+'.png',
//       filePath:this.data.imgs[i].tempFilePath,
//       success:(res)=>{
//         // imglist.concat(res.fileID)
//         console.log('成功',res)
//      //   that.data.imgs.push(JSON.parse(res.data).data)
//       },
//       fail:(err)=>{
//         console.log('失败',err)
//         wx.showToast({
//           title: "上传失败",
//           icon: "none",
//           duration: 1500
//         })
//       },
      

//     })
//   }
// },


  formsubmit(e){
    console.log(e)
    let content=e.detail.value.record
    let pid = '_'+this.data.id 
    if(content==''){
      console.log('空的')
      wx.showToast({
        title: '请输入打卡内容',
        icon: "none"
      })
    }
    else{ 
      // console.log('1111',this.data.imgs.length)
      var imgl=[]
      wx.cloud.uploadFile({
        cloudPath:'upload/'+Date.parse(new Date())+'.png',
        filePath:this.data.avatar,
        success:(res)=>{
          // console.log('成功',res)
          this.setData({
            cloud:res.fileID
          })
      this.setData({
        content
      })
      for(var i=0;i<this.data.imgs.length;i++){
        var url=this.data.imgs[i].tempFilePath
        // console.log('url',url)
        wx.cloud.uploadFile({
          cloudPath:'upload/'+Date.parse(new Date())+i+'.png',
          filePath: url,
          success:(res)=>{
            imgl.push(res.fileID)
              this.setData({
                imglist:imgl
              })
            if(this.data.imgs.length==this.data.imglist.length){
              db.collection("pyq").add({
                data:{
                  id:pid,
                  text:content,
                  url:this.data.imglist,
                  name:app.globalData.userInfo.nickName,
                  src:this.data.cloud,
                  love_text:0,
                  order:4
                }
              })
              .then(res=>{
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                wx.navigateBack({
                  delta: 1,
                  success: function () {
                  prevPage.onLoad(); // 执行上一页的onLoad函数
                  }
                })
              })
              
            }
            // console.log('data',this.data)

          }
        })
      }

      
       //   that.data.imgs.push(JSON.parse(res.data).data)
        },
        fail:(err)=>{
          console.log('失败',err)
          wx.showToast({
            title: "上传失败",
            icon: "none",
            duration: 1500
          })
        }
        })




     
    //   this.setData({
    //     content
    //   })
    //   // console.log('data',this.data)
    //  db.collection("pyq").add({
    //     data:{
    //       text:content,
    //       url:this.data.imglist,
    //       name:app.globalData.userInfo.nickName,
    //       src:this.data.cloudPath
    //     }
    //   })
    //   console.log(this.data.imglist)
    //   console.log(app.globalData.userInfo.nickName)
    //   console.log(this.data.cloudPath)


    }
  },

  reget(e){
    var that=this
    db.collection("submitcontent")
    .where({
     content:"apple"
    })
    .get({
      success:(res)=>{
        this.setData({
          content:res.data[0].content,
          imgs:res.data[0].imgs
        })
        console.log(res.data)
        console.log(that.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      avatar:app.globalData.userInfo.avatarUrl,
      id:options.id
    })   
    console.log('app',app.globalData)
   
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