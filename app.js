//app.js
App({
  url:'http://192.168.1.75:8081',
  // url:'http://192.168.1.100:8081',
  isAuthorized:false,
  myAddress:null,//我的收获地址
  showToast(msg){
    wx.showToast({
      title: msg,
      icon: "none",
      duration: 2000
    })
  },
  onLaunch: function() {
    wx.getSystemInfo({
      success: e => {
        console.log(e);
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.screenWidth=e.screenWidth;
        this.globalData.windowWidth=e.windowWidth;
        this.globalData.pixelRatio=e.pixelRatio;
      }
    })

    this.judgeAuth();
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
          // wx.reLaunch({
          //   url: '/pages/index/index'
          // });
        } else {
          that.isAuthorized=false
          // wx.reLaunch({ //当用户未授权过，进入授权界面
          //   url: '/pages/authorize/authorize'
          // });
        }
      }
    })
  },
  globalData: {
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  }
})