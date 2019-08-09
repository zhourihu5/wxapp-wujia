//app.js
App({
  url:'http://192.168.1.18:8081',
  // url:'http://192.168.1.20:8081',
  token:null,
  isAuthorized:false,
  myAddress:null,//我的收获地址
  wxUserInfo:null,
  nickName:null,
  userName:null,//用户手机号
  fid:null,//家庭ID
  wxCover:null,//微信头像
  communtityId:null,
  communtityCode:null,
  orderChanged:false,
  activityChanged:false,
  isCustomTabBar:false,
  showToast(msg){
    wx.showToast({
      title: msg,
      icon: "none",
      duration: 2000
    })
  },
  onLaunch: function(option) {
    try {
      const e = wx.getSystemInfoSync()
      console.log('获取设备系统信息success')
      console.log(e);
      this.globalData.StatusBar = e.statusBarHeight;
      this.globalData.screenWidth = e.screenWidth;
      this.globalData.windowWidth = e.windowWidth;
      this.globalData.pixelRatio = e.pixelRatio;
      let custom = wx.getMenuButtonBoundingClientRect();
      this.globalData.Custom = custom;
      this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    } catch (e) {
      console.log('获取设备系统信息fail')
      console.log(e)
    }

    this.judgeAuth();

    console.log('app onLaunch')
    console.log(option)
    wx.showShareMenu({
      withShareTicket: true,
      success:function (res) {
        console.log('showShareMenu success')
      }
    })
    var shareTicket=null
    shareTicket=option&&option.shareTicket
    if(shareTicket){
      wx.getShareInfo({
        shareTicket:shareTicket,
        success:function (res) {
          console.log('getShareInfo success')
          console.log(res)
        }
      })
    }

  },
  /**
   * 判断用户是否给了获取用户信息的授权
   */
  judgeAuth: function() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.isAuthorized=true
          // 必须是在用户已经授权的情况下调用
          wx.getUserInfo({
            success: function(res) {
              that.wxUserInfo=res
              // var userInfo = res.userInfo
              // var nickName = userInfo.nickName
              // var avatarUrl = userInfo.avatarUrl
              // var gender = userInfo.gender //性别 0：未知、1：男、2：女
              // var province = userInfo.province
              // var city = userInfo.city
              // var country = userInfo.country
            }
          })
        } else {
          that.isAuthorized=false
        }
      }
    })
  },
  globalData: {

  },
})