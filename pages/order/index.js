//index.js
const util = require('../../utils/util.js')
const app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        tabs: [
            {
                title: "全部",
                data:[1,]
            },
            {
                title: "待付款",
                data:[]
            },
            {
                title: "待收获",
                data:[1,2,]
            },
            {
                title: "已收货",
                data:[1,2,3,]
            },
            {
                title: "已过期",
                data:[1,2,3,4,5,6,7,8,9]
            },
        ]
    },
    onShow(){
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().init()
        }
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    },
    onPullDownRefresh: function() {
        // Do something when pull down.
        console.log('onPullDownRefresh')

    },
    onReachBottom: function() {
        // Do something when page reach bottom.
        console.log('onReachBottom')
    },
    scrolltoupper: function (e) {
        console.log("scrolltoupper")
        console.log(e)
        wx.showToast({
            icon: 'none',
            title: '你触发了下拉刷新',
            duration: 2000
        })
    },
    scrolltolower(e){
        console.log("scrolltolower")
        console.log(e)
        wx.showToast({
            icon: 'none',
            title: '你触发了上拉加载',
            duration: 2000
        })
    }

})
