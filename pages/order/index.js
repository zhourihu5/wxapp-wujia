//index.js
const util = require('../../utils/util.js')

Page({
    data: {
        tabs: [
            {
                title: "全部",
                data:[1,2,3,4,5,6,7,8,9]
            },
            {
                title: "待付款",
                data:[1,2,3,4,5,6,7,8,9]
            },
            {
                title: "待收获",
                data:[1,2,3,4,5,6,7,8,9]
            },
            {
                title: "已收货",
                data:[1,2,3,4,5,6,7,8,9]
            },
            {
                title: "已过期",
                data:[1,2,3,4,5,6,7,8,9]
            },
        ]
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    }
})
