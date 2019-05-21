// pages/posts/posts.js
const util = require('../../utils/util.js');  

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ratervalue: '',
    mobilevalue: '',
    showOrHiddenNewPost:true,
    boardlist: null,
    update: false,// 用于发布动态后的强制刷新标记
    userInfo: {},
    hasUserInfo: false,// 会导致每次加载授权按钮都一闪而过，需要优化
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,  
  // 最后一次单击事件点击发生时间
  lastTapTime: 0, 
  // 单击事件点击后要触发的函数
  lastTapTimeoutFunc: null, 

  },
  /**
   * 刷新数据
   */
  refresh: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.init({
      traceUser: true
    })
    wx.cloud.callFunction({
      // 云函数名称
      // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
      name: 'get_board_list',
      success: function (res) {
        //提取数据
        var data = res.result.boardlist.data
        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          data[i].update_time = util.formatTime(new Date(data[i].update_time))
        }
        wx.hideLoading()
        console.log(data)
        that.setData({
            boardlist: data
        })
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 这个工具资瓷日子过滤吗？
    console.log("posts.js - onLoad")
    
    wx.startPullDownRefresh()
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    console.log("posts.js - onShow")
    this.getuser()
    if (this.data.update) {
      wx.startPullDownRefresh()
      this.refresh()
      this.setData({
        update: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // TODO 主体功能完备后要支持分页加载
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 带参跳转
   */
  newPost: function(e) {

    if (this.data.mobilevalue && this.data.ratervalue>=5){
      wx.navigateTo({
        url: '../richtext/richtext'
      })

    }else{
      wx.showModal({
        title: '对不起',
        content: '您的权限不足',
        showCancel: false
      })
    }
   // wx.navigateTo({
    //  url: '../richtext/richtext'
   // })
  },
 // onItemClick: function (e) {
   // console.log(e.currentTarget.dataset.postid)
   // wx.navigateTo({
    //  url: '../richtextDetail/richtextDetail?postid=' + e.currentTarget.dataset.postid,
   // })
 // },

  onGotUserInfo: function (e) {
    console.log("nickname=" + e.detail.userInfo.nickName);
  },
  longTap: function(e) {
   // console.log("long tap")
   /* wx.showModal({
      title: '提示',
      content: '确定要修改吗？',
      success:function(res){
        if (res.confirm){
         console.log('用户点击确认')
         console.log("tap")
         console.log(e.currentTarget.dataset.postid)
           wx.navigateTo({
            url: '../publishedit/publishedit?postid=' + e.currentTarget.dataset.postid,
           })
        }else if(res.cancel){
          console.log('用户点击取消')

        }
     }
    })*/
  },

  getuser: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
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
        if (data[0]){
          that.setData({
              ratervalue: data[0].level||'',
           mobilevalue: data[0].mobile||'',
          })

          if (this.data.mobilevalue && this.data.ratervalue>=5){
            that.setData({
              showOrHiddenNewPost:false
            })
          }
        }
        wx.hideLoading()
      },
      fail: console.error
    })
  },
  touchStart: function(e) {
    this.touchStartTime = e.timeStamp
  },
 
  /// 按钮触摸结束触发的事件
  touchEnd: function(e) {
    this.touchEndTime = e.timeStamp
  },

   /// 单击、双击
   multipleTap: function(e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime
      
      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log("double tap")
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);

        if (this.data.mobilevalue && this.data.ratervalue>=5){
       wx.showModal({
          title: '提示',
          content: '确定要删除吗？',
          success:function(res){
             if (res.confirm){
              that.del(e.currentTarget.dataset.postid)
              console.log('用户点击确认')
             }else if(res.cancel){
               console.log('用户点击取消')

             }
          }
        })

      }
      } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        that.lastTapTimeoutFunc = setTimeout(function () {
          console.log("tap")
          console.log(e.currentTarget.dataset.postid)
            wx.navigateTo({
             url: '../richtextDetail/richtextDetail?boardid=' + e.currentTarget.dataset.postid,
            })
        
        }, 300);
      }
    }
  },
  del:function (postid){
    var that = this
    wx.cloud.callFunction({
      name: 'del_board_list',
      data: {
        postid: postid,//删除
       
      },
      success: function (res) {
         that.refresh()
      },
      fail: function(res) {
        that.publishFail('删除失败')
      }
    })
  },
  publishFail(info) {
    wx.showToast({
      image: '../../images/warn.png',
      title: info,
      mask: true,
      duration: 2500
    })
  }

})