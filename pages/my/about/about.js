// pages/my/about/about.js
import {$wuxSelect} from '../../../dist/index'
import data from './data'
const util = require('../../../utils/util.js')

const isTel = (value) => !/^1[34578]\d{9}$/.test(value)
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    gitUrl:"https://github.com/xc1255178487/web_learn",
    ratervalue:0,
    visible3:false,
    value:'',
    qqvalue:'',
    realname:'',
    address:'',
    diqu:'上海/松江老城',
    xiaoqu:'',
    jiedao:'中山街道',
    title1:"",
    title2:'',
    title3:'',
    options1: data,
        value1: [],
        options2: [
            {
                value: 'shanghai',
                label: '上海',
                isLeaf: false,
            }
           
        ],
        value2: [],
        value3: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData)
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
    wx.getStorage({
        key: 'userInfo',
        success: function (res) {
         
     
             console.log(res);
        },
        fail: function () {
          that.userInfoAuthorize()
        }
      })
    this.getuser()
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
  copy:function(e){
    let that = this;
    let type = e.currentTarget.dataset.type-0;
    wx.setClipboardData({
      data: type==0?that.data.gitUrl:that.data.csdnUrl,
      success:function(){
        wx.showToast({
          title: '复制成功',
          icon:"success",
          duration:1000,
        })
      }
    })
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
        error: isTel(e.detail.value),
        value: e.detail.value,
    })
},
onChangeRealname(e) {
  console.log('onChange', e)
  this.setData({
      
      realname: e.detail.value,
  })
},
onChangeAddress(e){
    console.log('onChange', e)
  this.setData({
      
      address: e.detail.value,
  })
},
onChangeQqvalue(e) {
  console.log('onChange', e)
  this.setData({
      
      qqvalue: e.detail.value,
  })
},


onFocus(e) {
    this.setData({
        error: isTel(e.detail.value),
    })
    console.log('onFocus', e)
},
onBlur(e) {
    this.setData({
        error: isTel(e.detail.value),
    })
    console.log('onBlur', e)
},
onConfirm(e) {
    console.log('onConfirm', e)
},
onClear(e) {
    console.log('onClear', e)
    this.setData({
        error: true,
        value: '',
    })
},
onError() {
    console.log(1)
    wx.showModal({
        title: '请输入11位数字',
        showCancel: !1,
    })
},
onOpen1() {
  this.setData({ visible1: true })
},
onClose1() {
  this.setData({ visible1: false })
},
onChange1(e) {
  this.setData({ title1: e.detail.options.map((n) => n.label).join('/') })
  console.log('onChange1', e.detail)
},
onOpen2() {
  this.setData({ visible2: true })
},
onClose2() {
  this.setData({ visible2: false })
},
onChange2(e) {
  console.log('onChange2', e.detail)
  this.setData({ value2: e.detail.value, title2: e.detail.done && e.detail.options.map((n) => n.label).join('/') })
},
onLoadOptions(e) {
  console.log('onLoadOptions', e.detail)
  const { value } = e.detail
  const options2 = [...this.data.options2]

  wx.showLoading({ mask: true })

  setTimeout(() => {
      if (value[value.length - 1] === 'shanghai') {
          options2.forEach((n) => {
              if (n.value === 'shanghai') {
                  n.children = [
                      {
                          value: 'songjiangold',
                          label: '松江老城'
                      },
                      {
                          value: 'songjiangnew',
                          label: '松江新城'
                      },
                  ]
              }
          })
      } else if (value[value.length - 1] === 'hangzhou') {
          options2.forEach((n) => {
              if (n.value === 'hangzhou') {
                  n.children = [
                      {
                          value: 'ali',
                          label: '阿里巴巴'
                      },
                      {
                          value: '163',
                          label: '网易'
                      },
                  ]
              }
          })
      }

      wx.hideLoading()

      this.setData({ value2: value, options2 })
  }, 1000)
},
onClick1() {
  $wuxSelect('#wux-select1').open({
      value: this.data.value1,
      options: [
          '荣都东侧',
          '荣都西侧',
          '同济雅筑',
          
      ],
      onConfirm: (value, index, options) => {
          console.log('onConfirm', value, index, options)
          if (index !== -1) {
              this.setData({
                  value1: value,
                  title1: options[index],
              })
          }
      },
  })
},

onClick2() {
  $wuxSelect('#wux-select2').open({
      value: this.data.value3,
      options: [
          '中山街道',
          '岳阳街道',
          
          
      ],
      onConfirm: (value, index, options) => {
          console.log('onConfirm', value, index, options)
          if (index !== -1) {
              this.setData({
                  value3: value,
                  title3: options[index],
              })
          }
      },
  })
},

getuser: function () {
  var that = this
  console.log("奇怪")
 
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
         value: data[0].mobile||'',
            realname: data[0].realname||'',
            qqvalue:data[0].qq||'',
            address:data[0].address||'',
            title1:data[0].xiaoqu||'',//小区
            title2:data[0].diqu||'',//地区
            title3:data[0].jiedao||'',//街道
           
        })
        if (data[0].mobile){
          that.setData({
          
            visible3:true
        })
        

      
        }else{
            that.setData({
                visible3:false
            })
            
          console.log('没有手机号码')
        }
      }
      wx.hideLoading()
     
    },
    fail: console.error
  })
},

save:function(){
    if (this.data.error){
        wx.showModal({
            title: '对不起',
            content: '手机号码不足11位',
            showCancel: false
          })
    }else{
        this.savelevel()
    }
    
},
modify:function(){
    if (this.data.error){
        wx.showModal({
            title: '对不起',
            content: '手机号码不足11位',
            showCancel: false
          })
    }else{
     this.updata()
    }
},
savelevel:function(){
    var that = this

  console.log(that.data)
 // console.log(app.globalData.openId)
  wx.showLoading({
    title: '加载中',
  })
  wx.cloud.init({
  })
  wx.cloud.callFunction({
    // 云函数名称
    // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
    name: 'modify_userinfo',
    data: {
      userid: app.globalData.openId,// 这个云端其实能直接拿到
      realname:that.data.realname,
      mobilevalue:that.data.value,
      level:1,
      qqvalue:that.data.qqvalue,
      address:that.data.address,
      diqu:that.data.title2,
      jiedao:that.data.title3,
      xiaoqu:that.data.title1,
    },
    success: function (res) {
      //提取数据
     console.log('保存成功')
      // 强制刷新，这个传参很粗暴
     // var pages = getCurrentPages();             //  获取页面栈
       // var prevPage = pages[pages.length - 2];    // 上一个页面
      //  prevPage.setData({
        //  update: true
     //   })
       wx.hideLoading()
       wx.switchTab({
        url:'../../grid/grid'
        });
      
    },
    fail: console.error
  })
},

updata:function(){
  var that = this

  console.log(that.data)
 // console.log(app.globalData.openId)
  wx.showLoading({
    title: '加载中',
  })
  wx.cloud.init({
  })
  wx.cloud.callFunction({
    // 云函数名称
    // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
    name: 'modify_userinfo',
    data: {
      userid: app.globalData.openId,// 这个云端其实能直接拿到
      realname:that.data.realname,
     // mobilevalue:that.data.value,
     // level:that.data.ratervalue,
      qqvalue:that.data.qqvalue,
      address:that.data.address,
      diqu:that.data.title2,
      jiedao:that.data.title3,
      xiaoqu:that.data.title1,
    },
    success: function (res) {
      //提取数据
     console.log('保存成功')
      
       // 强制刷新，这个传参很粗暴
     //  var pages = getCurrentPages();             //  获取页面栈
      // var prevPage = pages[pages.length - 2];    // 上一个页面
      // prevPage.setData({
      //   update: true
     //  })
      wx.hideLoading()
      wx.switchTab({
        url:'../../grid/grid'
        });
    },
    fail: console.error
  })


}
})