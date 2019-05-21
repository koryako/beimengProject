//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function () {
   // this.setData({
      //logs: (wx.getStorageSync('logs') || []).map(log => {
       // return util.formatTime(new Date(log))
     // })
    //})
  },
  onShow: function () {

    var that = this
    console.log("posts.js - onShow")
    if (this.data.update) {
      wx.startPullDownRefresh()
      that.refresh()
      this.setData({
        update: false
      })
    }

   

    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
       
   
           console.log(res);
      },
      fail: function () {
        that.userInfoAuthorize()
      }
    })
  },
  userInfoAuthorize: function () {
    var that = this
    console.log('authorize')
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 存储用户信息
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo.nickName)
              console.log(util.formatTime(new Date()))
             
              wx.setStorage({
                key: app.globalData.userInfo,
                data: res.userInfo,
              })
              app.globalData.wechatNickName = res.userInfo.nickName
              app.globalData.wechatAvatarUrl = res.userInfo.avatarUrl

              that.getuser()
            }
          })
        } else { // 跳转到授权页面 
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  onTapClick: function (e) {
    var tapname=e.currentTarget.dataset.tapname;
    console.log(tapname);

    if(tapname){
      wx.navigateTo({
        url: '../'+tapname+'/'+tapname,
      })
    }else {
        wx.showModal({
          title: '敬请期待',
          content: '功能开发中',
          showCancel: false
        })
    }
  
  },

  adduser:function(){
    var that = this
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'add_user',
      data: {
        openid: app.globalData.openId,// 这个云端其实能直接拿到
        author_name: app.globalData.wechatNickName,
        author_avatar_url: app.globalData.wechatAvatarUrl,
        publish_time: "",
        update_time: ""//目前让服务器自己生成这两个时间
      },
      success: function (res) {
         console.log('保存用户成功')
      },
      fail: function(res) {
        
      }
    })
  },
  getuser: function () {
    var that = this
   
    wx.cloud.init({
      traceUser: true
    })
    wx.cloud.callFunction({
      // 云函数名称
      // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
      name: 'get_userinfo',
      data: {
        authorid: app.globalData.openId,// 这个云端其实能直接拿到
        
      },
      success: function (res) {
        //提取数据
        var data = res.result.userinfo.data
        console.log(data[0])
        if (data.length==0){
          
          that.adduser()
        }
        
        
      },
      fail: console.error
    })
  },
})
