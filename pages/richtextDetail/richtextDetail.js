


let WxParse = require("../../wxParse/wxParse.js");
const util = require('../../utils/util.js');  

const app=getApp();
Page({
data:{
  boardid:'',
  contentLoaded: false,
  imagesLoaded: false,
  detail:[]
},
/**
   * 生命周期函数--监听页面加载
   */

onLoad: function (options) {
 
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
   
 

    // 更新浏览次数，TODO本地如何及时同步
    wx.cloud.callFunction({
      name: 'update_watch_count_boardlist',
      data: {
        postid: options.postid
      },
      success: function (res) {
        console.log('更新成功')
      }
    })

    // 获取内容
    wx.cloud.callFunction({
      // 云函数名称 
      name: 'get_board_detail',
      data: {
        boardid: options.boardid
      },
      success: function (res) {
        var boarddetail = res.result.boarddetail.data[0];
        boarddetail.publish_time = util.formatTime(new Date(boarddetail.publish_time))

        console.log(boarddetail)

      
        that.setData({
          detail: boarddetail,
          contentLoaded: true
        })
       that.downloadImages(boarddetail.datalist)
      },
      fail: console.error
    })
    this.setData({
      boardid: options.boardid
    })


 
  },

  rendershow:function (con){
    var that=this;
          //  wx.request({
     // url: Aurl + "?A=" + A,
    //  header: {
        //'content-type': 'application/json' // 默认值
    //  },
     // success: function (res) {
      
        let artilesA=[{content:con}];
 
        for(let i =0 ; i< artilesA.length ; i++){
 
          WxParse.wxParse('content'+i, 'html', artilesA[i]['content'], that, 5);
 
          if (i === artilesA.length - 1){
          
                  WxParse.wxParseTemArray("artileList", 'content', artilesA.length, that)
          }
        }   
        that.setData({
 
                  artiles:artilesA
           });
     // }
 
   // })

  },
   

  /**
   * 从数据库获取图片的fileId，然后去云存储下载，最后加载出来
   */
  downloadImages: function(image_urls){
    var that = this
    if(image_urls.length == 0){
      that.setData({
        imageUrls: [],
        imagesLoaded: true
      })
    } else {
      var urls = []
      for(let i = 0; i < image_urls.length; i++) {
        wx.cloud.downloadFile({
          fileID: image_urls[i].fileid,
          success: res => {
            // get temp file path
            console.log(res.tempFilePath)
            urls.push({url:res.tempFilePath,value:image_urls[i].value})
            if (urls.length == image_urls.length) {
              
              that.setData({
                imageUrls: urls,
                imagesLoaded: true
              })
              console.log(urls)
              console.log(that.data.detail.titles)
              let con='';
             con+='<div class="Artdetails"><div class="Artdetails_main"><h1>'+ that.data.detail.titles+'</h1>';
             con+= '<div class="ht">';
             con+=' <span id="hits" class="ar">访问量：'+that.data.detail.watch_count+'</span></div>';
             con+=' <div id="art"><span>'+that.data.detail.firstcon+'</span><br><br></div><br>';
              for (let i=0;i<urls.length;i++){
               con+='<img alt="" src="'+urls[i].url+'" style="width: 5.09rem; height: auto;"><br><br>';
                 con+='<br><div><span style="font-size: 1rem;">'+urls[i].value+'</span><br>&nbsp;</div><br><br>';
               }
               console.log(con)
             that.rendershow(con)
              this.checkLoadFinish()
            }
          },
          fail: err => {
            // handle error
          }
        })

      }
    }
    this.checkLoadFinish()
  },

  checkLoadFinish: function() {
    if (this.data.contentLoaded
          && this.data.imagesLoaded
         ){
      wx.hideLoading()
    }
  }

})