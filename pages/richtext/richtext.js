var Utils = require('../../utils/util.js')
var app = getApp()
var list = []
Page({
  data: {
    titles:'',
    maxContentLength: 100,
    minContentLength: 3,
    disabled:'disabled',
    content: '',
    height: 500,
    width: 320,
    imgIndex: 0,
    imageLength: 0,
    firstCon: '',
    dataList: [],
  },
  onLoad: function (options) {


    let that = this
     
  },
  onShow: function (e) {
    var that = this;
    //动态获取屏幕尺寸
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 输入监听
   */
  inputCon: function (e) {
    let that = this;
    if (0 === e.currentTarget.id - 0) {//第一个文本框的输入监听
      that.data.firstCon = e.detail.value;
    } else {
      that.data.dataList[e.currentTarget.id - 1].value = e.detail.value;
    }
  },
    /**
   * 输入标题监听
   */
  inputTitles: function (e) {
    let that = this;
   
      that.data.titles = e.detail.value;
   
  },
  /**
   * 失去焦点监听
   * 根据失去监听的input的位置来判断图片的插入位置
   */
  outBlur: function (e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * 添加图片
   */
  addImg: function () {
    var that = this;
    //这里考虑到性能，对于图片张数做了限制
    if (that.data.dataList.length >= 4) {//超过四张
      wx.showModal({
        title: '提示',
        content: '最多只能添加四张图片哦',
        confirmText: "我知道了",
        confirmColor: "#ef8383",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else {//添加图片
      wx.showActionSheet({
        itemList: ['从相册选择', '拍照'],
        itemColor: '#ef8383',
        success: function (res) {
          var choseType = res.tapIndex == 0 ? "album" : res.tapIndex == 1 ? "camera":"";
          if (choseType != "") {
            wx.chooseImage({
              sizeType: ['original'],//原图
              sourceType: [choseType],
              count: 1,//每次添加一张
              success: function (res) {
                var info = {
                  pic: res.tempFilePaths[0],//存储本地地址
                  temp: true,//标记是否是临时图片
                  value: '',//存储图片下方相邻的输入框的内容
                }
                that.data.dataList.splice(that.data.imgIndex,0,info);//方法自行百度
                that.setData({
                  dataList: that.data.dataList,
                })
              }
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /**
   * 删除图片
   */
  deletedImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex === 0) {//点击删除图片
          if (index === 0 && that.data.dataList[index].value != null) {//删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.dataList[index].value;
          } else if (index > 0 && that.data.dataList[index].value != null) {
            that.data.dataList[index - 1].value = that.data.dataList[index - 1].value + that.data.dataList[index].value;
          }
          that.data.dataList.splice(index, 1);
          that.setData({
            firstCon: that.data.firstCon,
            dataList: that.data.dataList
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //失败警告
  do_fail: function (a) {
    wx.showToast({
      title: a,
      icon: 'none',
      duration: 1000
    })
  },
   //发布按钮事件
   send: function () {
     console.log(this.data.titles)
     console.log( this.data.firstCon)
     console.log(this.data.dataList)
     if (this.data.titles.length < this.data.minContentLength) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '标题内容太短!',
      })
      return
    }
    var that = this;

    wx.showLoading({
      title: '发布中',
      mask: true
    })
    wx.cloud.init({
      traceUser: true
    })
    let dataList = that.data.dataList;
    let img_url_ok = [];
    //由于图片只能一张一张地上传，所以用循环
    if (dataList.length == 0) {
      this.publish([])
      return
    }
    for (let i = 0; i < dataList.length; i++) {
      var str = dataList[i].pic;
      var obj = str.lastIndexOf("/");
      var fileName = str.substr(obj + 1)
      console.log(fileName)
     
      wx.cloud.uploadFile({
        cloudPath: 'board_images/' + fileName,//必须指定文件名，否则返回的文件id不对
        filePath: dataList[i].pic, // 小程序临时文件路径
        success: res => {
          // get resource ID: 
          console.log(res)
          //把上传成功的图片的地址放入数组中
          img_url_ok.push({fileid:res.fileID,value:dataList[i].value})

          //如果全部传完，则可以将图片路径保存到数据库

          if (img_url_ok.length == dataList.length) {
            console.log(img_url_ok)
           that.publish(img_url_ok)

          }

        },
        fail: err => {
          // handle error
          that.publishFail('图片上传失败')
          console.log('fail: ' + err.errMsg)
        }
      })
    }
   },

    /**
   * 执行发布时图片已经上传完成，写入数据库的是图片的fileId
   */
  publish: function(img_url_ok) {
    /*  wx.showModal({
        title: '提示',
        content: app.globalData.wechatNickName,
        success:function(ress){
           if (ress.confirm){
            
            console.log('用户点击确认')
           }else if(ress.cancel){
             console.log('用户点击取消')
  
           }
        }
      })*/
      var that = this
      wx.cloud.callFunction({
        name: 'board_post',
        data: {
          openid: app.globalData.openId,// 这个云端其实能直接拿到
          author_name: app.globalData.wechatNickName,
          author_avatar_url: app.globalData.wechatAvatarUrl,
          titles:this.data.titles,
          firstcon:this.data.firstCon,
          datalist: img_url_ok,
          publish_time: "",
          update_time: ""//目前让服务器自己生成这两个时间
        },
        success: function (res) {
          // 强制刷新，这个传参很粗暴
        var pages = getCurrentPages();             //  获取页面栈
          var prevPage = pages[pages.length - 2];    // 上一个页面
          prevPage.setData({
            update: true
          })
         wx.hideLoading()
        wx.navigateBack({
            delta: 1
          })
        },
        fail: function(res) {
          that.publishFail('发布失败')
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
