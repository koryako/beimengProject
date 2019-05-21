// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "test-b59ecc"
})
// 云函数入口函数
exports.main = async (event, context) => {
  return {
    userinfo: await db.collection('user').where({ author_id: event.userInfo.openId }).field({
      _id: true,
      author_name: true,
      realname: true,
      author_avatar_url: true,
      mobile: true,
      level: true,
      qq:true,
      address:true,
      diqu:true,
      jiedao:true,
      xiaoqu:true,
      update_time: true
    }).orderBy('update_time', 'desc').get(),

  }
}