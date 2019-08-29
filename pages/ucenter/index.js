//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        items: [
            {
                title: "基本资料",
                icon: "/images/icon_profile.png",
                url: "/pages/baseInfo/index"
            },
            {
                title: "社区黄页",
                icon: "/images/icon_yellow_page.png",
                url: "/pages/yellowPage/index"
            },
            // {
            //     title: "门禁记录",
            //     icon: "/images/icon_open_record.png",
            //     url: "/pages/openRecord/index"
            // },
        ],
        nickName: '',
        phone: '',
        avatarUrl: '',
        customTabBarHeight:util.customTabBarHeight(),
    },
    showNavigationBarLoading(){
        this.setData({
            navigationBarLoading:true
        })
    },
    hideNavigationBarLoading(){
        this.setData({
            navigationBarLoading:false
        })
    },
    onShareAppMessage: function(res) {
        console.log('onShareAppMessage')
        console.log(res)
        if (res.from === 'button') {//邀请好友
            console.log('button onShareAppMessage')
        }
        return {
            // title: '吾家W+',//默认当前小程序名称
            path: '/pages/index/index' ,
            success: function(res) {
                console.log('onShareAppMessage success')
                console.log(res)
            }
        }
    },
    setBottomTabBar(){
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            // this.getTabBar().init()
            this.getTabBar().setData({
                active: 3,
            })
        }
    },
    onShow() {
        console.log('ucenter onShow')
        if(!app.isTabEnabled){
            console.log('getCurrentPages')
            console.log(getCurrentPages())
            wx.switchTab({
                url:'/pages/index/index'
            })
            return
        }
        this.setBottomTabBar()
    },
    onHide(){
        console.log('ucenter onHide')
    },
    nickNameChanged() {
        this.setData({
            nickName: app.nickName,
        })
    },
    onLoad: function () {
        console.log('ucenter onLoad')
        if(!app.isTabEnabled){
            console.log('getCurrentPages')
            console.log(getCurrentPages())
            wx.switchTab({
                url:'/pages/index/index'
            })
            return
        }
        this.setBottomTabBar()
        var userInfo = app.wxUserInfo
        this.setData({
            nickName: app.nickName || (userInfo && userInfo.userInfo && userInfo.userInfo.nickName),
            avatarUrl:app.wxCover || (userInfo && userInfo.userInfo && userInfo.userInfo.avatarUrl),
            phone: util.desensitization(app.userName),
        })
    },
})
