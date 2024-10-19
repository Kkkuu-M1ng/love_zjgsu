const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { seatId } = event;

  try {
    // 查询座位状态
    const seat = await db.collection('seats').where({ id: seatId }).get();

    if (seat.data.length > 0 && seat.data[0].status === 'available') {
      // 更新座位状态为已预约
      await db.collection('seats').doc(seat.data[0]._id).update({
        data: {
          status: 'reserved',
          reservedAt: new Date() // 记录预约时间
        }
      });
      return {
        success: true
      };
    } else if (seat.data.length > 0 && seat.data[0].status === 'reserved') {
      return {
        success: false,
        error: '座位已被预约'
      };
    } else {
      return {
        success: false,
        error: '座位不存在'
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
};
