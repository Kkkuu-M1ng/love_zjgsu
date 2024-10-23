const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { seatId, openid, action } = event; // 保持 seatId

  try {
    console.log(`Action: ${action}, Seat ID: ${seatId}, OpenID: ${openid}`); // 调试信息

    if (action === 'reserve') {
      // 查询座位状态
      const seat = await db.collection('badminton').where({ id: seatId }).get(); // 使用 seatId 查询
      console.log('查询结果:', seat); // 打印查询结果

      if (seat.data.length > 0 && seat.data[0].status === 'available') {
        // 更新座位状态为已预约
        await db.collection('badminton').doc(seat.data[0]._id).update({
          data: {
            status: 'reserved',
            reservedAt: new Date().toLocaleString(),
            openid: openid // 保存 openid
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
    } else if (action === 'cancel') {
      console.log(`正在查询的条件: id=${seatId}, openid=${openid}`); // 调试信息
      const seat = await db.collection('badminton').where({
        id: seatId, // 使用 seatId 查询
        openid: openid
      }).get();
      console.log('取消预约查询结果:', seat); // 打印查询结果

      if (seat.data.length > 0) {
        await db.collection('badminton').doc(seat.data[0]._id).update({
          data: {
            status: 'available',
            reservedAt: null,
            openid: '' // 清空 openid
          }
        });
        return { success: true };
      } else {
        return { success: false, error: '预约不存在或已被取消' };
      }
    }
  } catch (err) {
    console.error('错误信息:', err);
    return {
      success: false,
      error: err.message
    };
  }
};