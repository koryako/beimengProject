// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()
/**
 * 在此处设置数据库环境会导致每个云函数都需要手动设置，不能一次修改，十分麻烦
 * 一种方法是在小程序端传入环境参数，可以把环境集中在小程序的globalData中管理
 */
const db = cloud.database({
  env: "test-b59ecc"
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // const timestamp = Date.now()
    await db.collection('board_collection').where({
      _id: event.postid
    })
      .update({
        data: {
          del: true
        }
      })



  } catch (e) {
    console.error(e)
  }
}