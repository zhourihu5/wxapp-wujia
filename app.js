App({
    // url:'http://192.168.250.6:8181',
    // url:'http://192.168.250.134:8181',
    // url: 'http://testapi.home-guard.cn',
    url: 'https://api.home-guard.cn',
    token: null,
    isAuthorized: false,
    myAddress: null,//我的收获地址
    wxUserInfo: null,
    nickName: null,
    userName: null,//用户手机号
    fid: null,//家庭ID
    wxCover: null,//微信头像
    communtityId: null,
    communtityCode: null,
    orderChanged: false,
    activityChanged: false,
    isCustomTabBar: false,
    isTabEnabled: true,
    failReason: null,

    showToast(msg) {
        wx.showToast({
            title: msg,
            icon: "none",
            duration: 2000
        })
    },
    setSystemInfo(e) {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.screenWidth = e.screenWidth;
        this.globalData.windowWidth = e.windowWidth;
        this.globalData.windowHeight = e.windowHeight;

        this.globalData.pixelRatio = e.pixelRatio;
        let custom = wx.getMenuButtonBoundingClientRect()
        console.log('getMenuButtonBoundingClientRect', custom)
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    },
    onLaunch: function (option) {
        try {
            const e = wx.getSystemInfoSync()
            console.log('获取设备系统信息success',e)
            this.setSystemInfo(e)
            if(this.globalData.StatusBar&&this.globalData.screenWidth&&this.globalData.windowWidth
                &&this.globalData.windowHeight&&this.globalData.pixelRatio
            &&this.globalData.Custom
            &&this.globalData.Custom.bottom
            &&this.globalData.CustomBar){
                wx.setStorage({
                    key: 'SystemInfo',
                    data: e
                })
            }

        } catch (ex) {
            console.log('获取设备系统信息fail',ex)

        }
        if(this.globalData.StatusBar&&this.globalData.screenWidth&&this.globalData.windowWidth
            &&this.globalData.windowHeight&&this.globalData.pixelRatio
            &&this.globalData.Custom
            &&this.globalData.Custom.bottom
            &&this.globalData.CustomBar){

        }else {
            var e = wx.getStorageSync('SystemInfo')
            if (e) {
                console.log('从缓存文件中获取设备系统信息成功')
                try {
                    this.setSystemInfo(e)
                } catch (ex2) {
                    console.log('setSystemInfo err ',ex2)
                }
            }
        }

        if(!this.globalData.StatusBar){
            this.globalData.StatusBar=31
            console.log('设置默认 StatusBar',this.globalData.StatusBar)
        }
        if(!this.globalData.Custom|| !this.globalData.Custom.bottom){
            this.globalData.Custom ={//获取不到就设置默认值
                bottom: 70,
                height: 32,
                left: 287,
                right: 383,
                top: 38,
                width: 96,
            };
            this.globalData.CustomBar =this.globalData.Custom.bottom + this.globalData.Custom.top - this.globalData.StatusBar;
            console.log('设置默认 CustomBar',this.globalData.CustomBar)
            console.log('设置默认 Custom',this.globalData.Custom)
        }

        this.judgeAuth();

        console.log('app onLaunch')
        console.log(option)
        wx.showShareMenu({
            withShareTicket: true,
            success: function (res) {
                console.log('showShareMenu success')
            }
        })
        var shareTicket = null
        shareTicket = option && option.shareTicket
        if (shareTicket) {
            wx.getShareInfo({
                shareTicket: shareTicket,
                success: function (res) {
                    console.log('getShareInfo success')
                    console.log(res)
                }
            })
        }

    },
    /**
     * 判断用户是否给了获取用户信息的授权
     */
    judgeAuth: function () {
        var that = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    that.isAuthorized = true
                    // 必须是在用户已经授权的情况下调用
                    wx.getUserInfo({
                        success: function (res) {
                            that.wxUserInfo = res
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
                    that.isAuthorized = false
                }
            }
        })
    },
    globalData: {},
})