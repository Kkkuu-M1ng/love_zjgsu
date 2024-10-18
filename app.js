// app.js

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js')
App({
  
  globalData: {
    userInfo: {
      avatarUrl:defaultAvatarUrl,
      nickName:''
    },
    issign:false,
    openid: '',
    patrolForm: {
      checkaddress: "",
      searchtime:"",
      searchuser:"",
      latandlon:""
  },
    user:{
      userName:""
    },




  
    
  // 实例化API核心类
  qqmapsdk: new QQMapWX({
    key: 'EHPBZ-FSPCU-CZZVY-GUKE4-VZE2K-DDF5C' // 必填
  }),

    },
    //云开发    
    //
    demo: function () { //获取openId
      const _this = this
      return new Promise(function (resolve, reject) {
        wx.login({
          success(res) {
            console.log(res); 
          }
        })
      })
    },
  

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
		wx.cloud.init({
			env:"kkkuu-0grpbz9w07d0cf1c"
			}),

    // 登录
    wx.login({
      success: res => {
        console.log('res.code',res.code)
        this.getOpenId(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  getOpenId(code) {  
    wx.cloud.callFunction({  
      name: 'getopenId', // 替换为你的云函数名称  
      data: { code },  
      success: res => {  
        const { openid, error } = res.result;  
        if (error) {  
          console.error('调用云函数失败:', error);  
        } else {  
          console.log('获取到的 openid:', openid);  
          this.globalData.openid = openid;
           // 存储到 globalData 中  
           console.log(this.globalData.openid)
        }  
      },  
      fail: err => {  
        console.error('调用云函数失败', err);  
      }  
    });  
  }   
})
