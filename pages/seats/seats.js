const app = getApp();

Page({
  data: {
    seats: [], // 座位数组
    currentFloor: 1, // 当前楼层
    selectedSeat: null, // 选中的座位
    seatNumbers: [], // 座位号数组
    timeSlots: ['09:00', '10:00', '11:00', '12:00'] // 示例时间段
  },
  

  onLoad() {
    this.loadSeats();
  },

  async loadSeats() {
    // 清空座位数据
    this.setData({ seats: [], seatNumbers: [] });
    console.log('当前楼层:', this.data.currentFloor); // 添加调试信息
    // 从云数据库加载当前楼层的座位数据
    const res = await wx.cloud.database().collection('seats').where({
      floor: parseInt(this.data.currentFloor)
    }).get();
    
    
    
    console.log(res.data); // 打印获取的座位数据
    // 更新座位数据并初始化座位号
    if (res.data.length > 0) {
      this.setData({ seats: res.data });
      this.initializeSeatNumbers();
    } else {
      console.log("没有找到座位数据");
    }
  },

  initializeSeatNumbers() {
    // 提取座位号
    const seatNumbers = this.data.seats.map(seat => seat.seatNumber);
    this.setData({ seatNumbers });
  },

  switchFloor(e) {
    const floor = e.currentTarget.dataset.floor;
    this.setData({ currentFloor: floor }, () => {
      console.log("当前楼层:", this.data.currentFloor);
      this.loadSeats(); // 重新加载座位
    });
  },
  
  

  reserveSeat(e) {
    const seatId = e.currentTarget.dataset.id;
    const seat = this.data.seats.find(seat => seat.id === seatId);
    
    if (seat && seat.status === 'available') {
      this.setData({ selectedSeat: seatId });
      wx.showToast({
        title: '已选择座位 ' + seat.seatNumber,
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '座位已被预约',
        icon: 'none'
      });
    }
  },

  async confirmReservation() {
    const { selectedSeat } = this.data;
    const userId = app.globalData.userId; // 获取当前用户ID

    if (!selectedSeat) {
      wx.showToast({
        title: '请先选择座位',
        icon: 'none'
      });
      return;
    }

    // 调用云函数预约座位
    const result = await wx.cloud.callFunction({
      name: 'reserveSeat',
      data: {
        seatId: selectedSeat,
        userId
      }
    });

    if (result.result.success) {
      // 更新本地状态
      const seats = this.data.seats.map(seat => {
        if (seat.id === selectedSeat) {
          seat.status = 'reserved'; // 更新座位状态
        }
        return seat;
      });
      this.setData({ seats, selectedSeat: null }); // 重置选中的座位
      wx.showToast({
        title: '预约成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '预约失败: ' + result.result.error,
        icon: 'none'
      });
    }
  }
});
