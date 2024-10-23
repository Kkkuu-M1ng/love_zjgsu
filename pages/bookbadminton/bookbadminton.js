const app = getApp();

Page({
  data: {
    seats: [], // 座位数组
    selectedSeat: null, // 选中的座位
    selectedTimeSlot: null, // 选中的时间段
    timeSlots: ['09:00', '10:00', '11:00', '13:00','14:00', '15:00', '19:00', '20:00'] // 示例时间段
  },

  onLoad() {
    this.loadSeats();
  },

  onShow() {
    this.loadSeats(); // 每次页面显示时刷新预约数据
  },

  async loadSeats() {
    this.setData({ seats: [] });

    // 从云数据库加载当前楼层的座位数据
    const res = await wx.cloud.database().collection('badminton').where({
      floor: parseInt(this.data.currentFloor)
    }).get();

    console.log(res.data); // 打印获取的座位数据

    // 更新座位数据并初始化
    if (res.data.length > 0) {
      const groupedSeats = this.groupSeatsByNumber(res.data);
      this.setData({ seats: groupedSeats });
    } else {
      console.log("没有找到座位数据");
    }
},


  groupSeatsByNumber(seats) {
    const grouped = {};

    // 按座位号分组
    seats.forEach(seat => {
      const seatNumber = seat.name;
      if (!grouped[seatNumber]) {
        grouped[seatNumber] = [];
      }
      grouped[seatNumber].push(seat);
    });

    // 转换为数组形式以便于 WXML 渲染
    return Object.keys(grouped).map(key => ({
      seatNumber: key,
      timeSlots: grouped[key] // 这里依然保留 timeSlots，稍后使用正确的字段名
    }));
  },

  navigateTome() {
    wx.navigateTo({
      url: '/pages/mybadminton/mybadminton',
    });
  },

  switchFloor(e) {
    const floor = e.currentTarget.dataset.floor;
    this.setData({ currentFloor: floor }, () => {
      console.log("当前楼层:", this.data.currentFloor);
      this.loadSeats(); // 重新加载座位
    });
  },

  reserveSeat(e) {
    const seatId = e.currentTarget.dataset.id; // 获取点击的座位 ID
    console.log("获取到的座位 ID:", seatId); // 输出座位 ID

    // 输出当前座位数据
    console.log("当前座位数据:", this.data.seats);

    // 直接使用座位 ID 查找对应的座位
    const seat = this.data.seats.flatMap(seatGroup => seatGroup.timeSlots).find(seat => seat.id === seatId);

    // 检查座位是否存在
    if (!seat) {
      wx.showToast({
        title: '座位不存在',
        icon: 'none'
      });
      return;
    }

    // 检查座位是否已被其他用户预约
    if (seat.status === 'reserved') {
      wx.showToast({
        title: '座位已被预约',
        icon: 'none'
      });
      return;
    }

    // 设置当前选中的座位
    this.setData({ selectedSeat: seatId });

    // 确保 timeSlot 存在并且有可用时间段
    if (seat.timeSlot && seat.timeSlot.length > 0) {
      this.setData({ selectedTimeSlot: seat.timeSlot[0] }); // 自动选择第一个可用的时间段
      wx.showToast({
        title: seat.name,
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '没有可用的时间段',
        icon: 'none'
      });
    }
  },

  async confirmReservation() {
    const { selectedSeat, selectedTimeSlot } = this.data;
    const openid = app.globalData.openid; // 获取 openid

    // 检查是否选择了座位
    if (!selectedSeat) {
      wx.showToast({
        title: '请先选择座位',
        icon: 'none'
      });
      return;
    }
  
    // 检查是否选择了时间段
    if (!selectedTimeSlot) {
      wx.showToast({
        title: '请选择时间段',
        icon: 'none'
      });
      return;
    }
  
    try {
      // 调用云函数进行预约
      const res = await wx.cloud.callFunction({
        name: 'reserveBadminton',
        data: {
          seatId: selectedSeat, // 只传递座位ID
          openid: openid, // 添加 openid
          action: 'reserve' // 预约操作
        }
      });
  
      if (res.result.success) {
        // 更新本地状态
        const seats = this.data.seats.map(seatGroup => ({
          ...seatGroup,
          timeSlots: seatGroup.timeSlots.map(seat => {
            if (seat.id === selectedSeat) {
              seat.status = 'reserved';
            }
            return seat;
          })
        }));
  
        // 重置选中的座位和时间段
        this.setData({ seats, selectedSeat: null, selectedTimeSlot: null });
  
        wx.showToast({
          title: '预约成功',
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
        title: '预约失败: ' + err.message,
        icon: 'none'
      });
    }
  }
  
});
