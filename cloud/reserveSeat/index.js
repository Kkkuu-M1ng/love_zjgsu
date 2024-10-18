const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const { seatId, userId } = event;

  try {
    // 查询座位状态
    const seat = await db.collection('seats').doc(seatId).get();
    
    if (seat.data.status === 'available') {
      // 更新座位状态为已预约
      await db.collection('seats').doc(seatId).update({
        data: {
          status: 'reserved',
          reservedBy: userId,
          reservedAt: new Date()
        }
      });
      return {
        success: true
      };
    } else {
      return {
        success: false,
        error: '座位已被预约'
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
};
