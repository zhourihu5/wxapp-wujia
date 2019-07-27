//index.js
const util = require('../../utils/util.js')

Page({
    data: {
        items: [
            {
                title: "基本资料",
                icon:"/images/icon_profile.png",
                url:"/pages/baseInfo/index"
            },
            {
                title: "社区黄页",
                icon:"/images/icon_yellow_page.png",
                url:"/pages/yellowPage/index"
            },
            {
                title: "申请线上开锁",
                icon:"/images/icon_lock.png",
                url:"/pages/neibourList/index"
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
    }
})
