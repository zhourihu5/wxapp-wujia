//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        items: [
            {
                title: "基本资料",
                icon: "/images/icon_profile.png",
                url: "/pages/baseInfo/index",
                width:40,
                height:40,//rpx
            },
            {
                title: "社区黄页",
                icon: "/images/icon_yellow_page.png",
                url: "/pages/yellowPage/index",
                width:40,
                height:40,//rpx
            },
            // {
            //     title: "门禁记录",
            //     icon: "/images/icon_open_record.png",
            //     url: "/pages/openRecord/index"
            // },
            {
                title: "我的优惠券",
                icon: "/images/icon_my_discount_coupon.png",
                url: "/pages/myDiscountCoupon/index",
                width:40,
                height:34,//rpx
            },
            {
                title: "我的体验券",
                icon: "/images/icon_my_coupon.png",
                url: "/pages/myCoupon/index",
                width:40,
                height:34,//rpx
            },
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
    itemClicked(e){
        if(!app.userName){
            wx.reLaunch({
                url:'/pages/index/index'
            })
            return;
        }
        let index=e.currentTarget.dataset.index
        let url=this.data.items[index].url
        wx.navigateTo({
            url:url,
        })
    },
})
