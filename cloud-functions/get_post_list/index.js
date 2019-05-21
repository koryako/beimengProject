// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "test-b59ecc"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    postlist: await db.collection('post_collection').where({del:false}).field({
      _id: true,
      author_name: true,
      content: true,
      author_avatar_url:true,
      title: true,
      watch_count: true,
      update_time: true
    }).orderBy('update_time', 'desc').get(),

  }
}