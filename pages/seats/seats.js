const app = getApp();

Page({
  data: {
    seats: [], // 座位数组
    currentFloor: 1, // 当前楼层
    selectedSeat: null, // 选中的座位
    selectedTimeSlot: null, // 选中的时间段
    timeSlots: ['09:00', '10:00', '11:00', '12:00'] // 示例时间段
  },

  onLoad() {
    this.loadSeats();
  },

  async loadSeats() {
    // 清空座位数据
    this.setData({ seats: [] });
    console.log('当前楼层:', this.data.currentFloor);

    // 从云数据库加载当前楼层的座位数据
    const res = await wx.cloud.database().collection('seats').where({
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
      const seatNumber = seat.seatNumber;
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
        title: '已选择座位 ' + seat.seatNumber + ' 和时间段 ' + seat.timeSlot[0],
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
    const userId = app.globalData.userId; // 获取当前用户ID

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
      // 更新座位状态为 reserved，并记录用户ID和预约时间
      await wx.cloud.database().collection('seats').doc(selectedSeat).update({
        data: {
          status: 'reserved',
          reservedBy: userId,
          reservedAt: new Date() // 记录预约时间
        }
      });

      // 将预约信息记录到 yyuser 集合
      await wx.cloud.database().collection('yyuser').add({
        data: {
          userid: userId,     // 用户 ID
          yyid: selectedSeat, // 座位 ID
          yytime: selectedTimeSlot // 预约时间段
        }
      });

      // 更新本地状态
      const seats = this.data.seats.map(seatGroup => ({
        ...seatGroup,
        timeSlots: seatGroup.timeSlots.map(seat => {
          if (seat.id === selectedSeat) { // 使用 id
            seat.status = 'reserved'; // 更新座位状态为已约
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
    } catch (err) {
      wx.showToast({
        title: '预约失败: ' + err.message,
        icon: 'none'
      });
    }
  }
});
