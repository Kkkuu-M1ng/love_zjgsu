// pages/pic/pic.js
const db=wx.cloud.database()
const app=getApp()
let currentPage = 0 // 当前第几页,0代表第一页 
let pageSize = 3 //每页显示多少数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    url:'',
    ui:'',
    list:[],
    cloudPath:'',
    avatar:'',
    is_like:[], //查看该朋友圈点赞情况
    like_arr:[], //获取用户点击所有的点赞内容
    pyq_arr:[], //获取朋友圈内容
    like_id:'', //点击哪个点赞
    openid:'',
    comment:'',
    comment_id:'',
    comment_name:[],
    comment_content:[],
    viewHeight: 0 // 初始高度
  },

  inputGet(options) {
    //获取输入框输入的内容
    let value = options.detail.value;
    // console.log("输入框输入的内容是 " + value)
    this.setData({
      comment:value
    })
  },

  infoSet(e)
  {
    this.setData({ show: false });
    console.log(this.data.comment_id)
    db.collection('pyq').doc(this.data.comment_id).update({
      data:{
        comment:db.command.addToSet(this.data.comment),
        comment_user:db.command.push(app.globalData.userInfo.nickName)
      }
    })
    .then(res=>{
      console.log('评论上传成功')
      this.setData({
        comment:''
      })
      this.onLoad()
    })
    .catch(res=>{
      console.log(err)
    })
  },

  onClose(e) {
    this.setData({ show: true });
    let _id = e.currentTarget.dataset.id
  },
  // 点击下拉显示框
  selectTap(e) {
    this.setData({
      show: !this.data.show
    });
    let _id = e.currentTarget.dataset.id
    this.setData({
      comment_id:_id
    })
  },

  Close() {  
    this.setData({ show: false });  
  }, 

  deleteinfo(e)
  {
    console.log('需要删除信息内容',e)
    let _id=e.currentTarget.dataset.id
    wx.showModal({
      title: '删除提示',
      content: '确认要删除发出的内容吗？',
      complete: (res) => {
        if (res.cancel) {
          console.log('取消删除')
        }
    
        if (res.confirm) {
          console.log('继续删除')
          db.collection('pyq').doc(_id).remove().then(res=>{
            console.log('删除成功')
            db.collection('user').doc(this.data.openid).update({
              data:{
                pyq:db.command.pull(_id)
              }
            })
            .then(res=>{
              this.onLoad()
            })
            
          })
          
        }
      }
    })
  },

  checklike(e)
  {
    console.log(this.data.like_arr)
    console.log(this.data.pyq_arr)
    this.data.pyq_arr.forEach(item=>{
      this.data.is_like.push(this.data.like_arr.includes(item))
    })
    this.setData({
      is_like:this.data.is_like
    })
    console.log(this.data.is_like)
  },

  getlike(e)
  {
    let openid = app.globalData.openid
    db.collection('user').doc(openid).get()
    .then(res=>{
      let like_arr=res.data.pyq
      this.setData({
        like_arr:like_arr
      })
      console.log(this.data.like_arr)
      // let str = "ef45322e66ee6dc80bff745b2fc89891"
      // const isinclude = this.data.like_arr.includes(str)
      // console.log(isinclude)
      console.log('点赞获取成功')
    })
    .catch(res=>{
      console.log('点赞获取失败',err)
    })
  },

  likeinfo(e){
    console.log(e)
    let _id=e.currentTarget.dataset.id
    db.collection('pyq').doc(_id).get().then(res=>{
      let updateLike = this.data.is_like.slice()
      console.log(res.data.order-1)
      updateLike[res.data.order-1] = !updateLike[res.data.order-1]
      this.setData({
        is_like : updateLike,
        like_id : res.data.order-1
      })
      console.log(this.data.like_id)

      
      if(this.data.is_like[this.data.like_id])
    {
      db.collection('pyq').doc(_id).get().then(res => {  
        // 获取当前的 love_text 值  
        let currentLoveText = res.data.love_text || 0; // 如果不存在，默认设置为 0  
      
        // 更新 love_text 的值  
        return db.collection('pyq').doc(_id).update({  
          data: {  
            love_text: currentLoveText + 1 // 更新值加 1  
          }  
        });  
      }).then(() => {  
        console.log('更新成功');  
        this.onLoad()
      }).catch(err => {  
        console.error('更新失败', err);  
      });  
      
      let openid = app.globalData.openid
      db.collection('user').doc(openid).update({
        data:{
          pyq:db.command.addToSet(_id)
        }
      })
      .then(res=>{
        console.log('添加成功')
      })
      .catch(err=>{
        console.log('添加失败',err)
      })

    }
    else{
      db.collection('pyq').doc(_id).get().then(res => {  
        // 获取当前的 love_text 值  
        let currentLoveText = res.data.love_text || 0; // 如果不存在，默认设置为 0  
      
        // 更新 love_text 的值  
        return db.collection('pyq').doc(_id).update({  
          data: {  
            love_text: currentLoveText - 1 // 更新值加 1  
          }  
        });  
      }).then(() => {  
        console.log('更新成功');  
        this.onLoad()
      }).catch(err => {  
        console.error('更新失败', err);  
      });  
      let openid = app.globalData.openid
      db.collection('user').doc(openid).update({
        data:{
          pyq:db.command.pull(_id)
        }
      })
      .then(res=>{
        console.log('删除成功')
      })
      .catch(err=>{
        console.log('删除失败',err)
      })
    }
    })
    
    
  },


  getpyq(){
    var i='_'+this.data.id
    db.collection('pyq')
    .where({
      id:i
    })
    .get()
    .then(res=>{
      console.log(res.data)
      this.setData({
        list:res.data.reverse(),
        pyq_arr:res.data.map(item => item._id)
      })
      // console.log(this.data.pyq_arr)
//////////

//getlike()
      let openid = app.globalData.openid
    db.collection('user').doc(openid).get()
    .then(res=>{
      let like_arr=res.data.pyq
      this.setData({
        like_arr:like_arr
      })
      // console.log(this.data.like_arr)
      // let str = "ef45322e66ee6dc80bff745b2fc89891"
      // const isinclude = this.data.like_arr.includes(str)
      // console.log(isinclude)
      console.log('点赞获取成功')
/////////

//checklike()
    // console.log(this.data.like_arr)
    // console.log(this.data.pyq_arr)
    const reorderedArr = this.data.pyq_arr.map(item=>like_arr[like_arr.indexOf(item)])
    console.log(reorderedArr)
    let islike_arr = []
    this.data.pyq_arr.forEach(item=>{
      
      islike_arr.push(this.data.like_arr.includes(item))
    })
    this.setData({
      is_like: islike_arr.reverse()
    })
    // console.log(this.data.is_like)

//////
    })
    .catch(res=>{
      console.log('点赞获取失败',err)
    })
      },
    )
},

  getpic(){
    var i = this.data.id-1
    db.collection('markers')
    .get({
      success:(res)=>{
        this.setData({
          url:res.data[i].url,
          ui:res.data[i].ui,
        })
        console.log('当前图片 URL:', this.data.url);
        // console.log(this.data)
      }
    })
  },


  // getcomment(e)
  // {
  //   db.collection('pyq').get().then(res=>{
  //     console.log('获取成功')
  //     this.setData({
  //       comment_name:res.data.comment_user,
  //       comment_content:res.data.comment
  //     })
  //     console.log(res)
  //   })
  //   .catch(res=>{
  //     console.log('获取失败',err)
  //   })
  // },

  upload(){
    wx.navigateTo({
      url: '/pages/photo/photo?id='+this.data.id,
    })
  },


  preview(event) {
    console.log(event)
    let currentUrl = event.currentTarget.dataset.src
    let currentid = event.currentTarget.dataset.id
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.list[currentid].url // 需要预览的图片http链接列表
    })
  },

  updateCommentContainerHeight: function() {  
    const query = wx.createSelectorQuery();  
    
    query.select('.comment-container').boundingClientRect((rect) => {  
      this.setData({  
        viewHeight: rect.height // 设置为计算得到的高度  
      });  
    }).exec();  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    if(options)
    that.setData({
      id:options.id
    })
    // console.log(this.id)
    that.setData({
      openid:app.globalData.openid
    })
    // console.log(this.data.openid)
    // console.log(app.globalData.openid)
    that.getpic()
    that.getpyq()
    that.updateCommentContainerHeight();  
    // that.getcomment()
    // that.getlike()
    // that.checklike()
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