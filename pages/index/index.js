// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

const app=getApp()
let a=false;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  bindViewTap() {
    const db = wx.cloud.database()
    let openid = app.globalData.openid
    db.collection('user').doc(openid).get()
        .then(res =>{
            wx.showToast({
                title: "欢迎回来",
                icon: "none"
              })
            console.log(this.data.userInfo.nickName)
        })
        .catch(err =>{
            wx.cloud.database().collection('user').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  _id: openid,
                  name:this.data.userInfo.nickName,
                  pyq:[]
                }
              })
              .then(res => {
                wx.showToast({
                  title: "登陆成功",
                  icon: "right"
                })
              })
        })
    wx.switchTab({
      url: '/pages/me/me'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
    app.globalData.userInfo.avatarUrl=avatarUrl
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
    app.globalData.userInfo.nickName=nickName
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
})
