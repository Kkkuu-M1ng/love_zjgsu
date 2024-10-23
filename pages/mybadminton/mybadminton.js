const app = getApp();

Page({
  data: {
    reservations: [] // 用户预约的座位信息
  },

  onLoad() {
    this.loadReservations();
  },

  async loadReservations() {
    console.log('用户openid:', app.globalData.openid);
    try {
      const res = await wx.cloud.database().collection('badminton').where({
        openid: app.globalData.openid // 使用 openid 查询预约信息
      }).get();

      this.setData({
        reservations: res.data // 更新状态
      });
    } catch (err) {
      wx.showToast({
        title: '加载预约失败: ' + err.message,
        icon: 'none'
      });
    }
  },

  showConfirmDialog(e) {
    const seatId = e.currentTarget.dataset.id; // 获取预约的座位 ID
    console.log("获取到的座位 ID:", seatId); // 添加调试信息，输出座位 ID
    wx.showModal({
      title: '确认取消预约',
      content: '您确定要取消该预约吗？',
      success: (res) => {
        if (res.confirm) {
          this.cancelReservation(seatId); // 使用座位 ID 取消预约
        }
      }
    });
  },

  async cancelReservation(seatId) {
    const openid = app.globalData.openid; // 获取用户的 openid
    try {
      const res = await wx.cloud.callFunction({
        name: 'reserveBadminton', // 确保云函数名称正确
        data: {
          seatId: seatId, // 使用座位 ID
          openid: openid,
          action: 'cancel' // 取消预约操作
        }
      });

      if (res.result.success) {
        this.loadReservations(); // 重新加载预约数据
        wx.showToast({
          title: '取消预约成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.result.error,
          icon: 'none'
        });
      }
    } catch (err) {
      wx.showToast({
        title: '取消预约失败: ' + err.message,
        icon: 'none'
      });
    }
  }
});
