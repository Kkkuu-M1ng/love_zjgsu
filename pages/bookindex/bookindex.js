// pages/bookindex/bookindex.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsItem1: {
      imageUrl: '/pages/image/banner.jpg', // 替换为实际的图片链接
      title: '新闻标题 1',
      description: '这是新闻内容 1 wewewewewewewe'
    },
    newsItem2: {
      imageUrl: '/pages/image/banner.jpg', // 替换为实际的图片链接
      title: '新闻标题 2',
      description: '这是新闻内容 2'
    },
  },

  navigateToProfile() {
    wx.navigateTo({
      url: '/pages/my/my', // 替换为实际个人页面路径
    });
  },

  navigateToSeats() {
    // 导航到座位页面
    wx.navigateTo({
      url: '/pages/seats/seats', // 替换为实际座位页面路径
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 可以在这里进行其他初始化操作
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面初次渲染完成
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 页面隐藏
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 处理下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 处理上拉触底
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // 处理分享
  }
});
