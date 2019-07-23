//index.js
const util = require('../../utils/util.js')

Page({
    data: {
        items: [
            {
                title: "基本资料",
                icon:"/images/tab/img_doctor.png",
                url:"/pages/baseInfo/index"
            },
            {
                title: "社区黄页",
                icon:"/images/tab/img_doctor.png",
                url:"/pages/yellowPage/index"
            },
            {
                title: "申请线上开锁",
                icon:"/images/tab/img_doctor.png",
                url:"/pages/neibourList/index"
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
