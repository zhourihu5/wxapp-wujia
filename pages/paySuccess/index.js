//index.js
const util = require('../../utils/util.js')

Page({
    data: {
        items: [
            {
                title: "全部",
                msg:"你的作品最多19个字",
                icon:"/images/tab/img_doctor.png",
                time:"30分钟前"
            },
            {
                title: "全部",
                msg:"你的作品最多19个字",
                icon:"/images/tab/img_doctor.png",
                time:"30分钟前"
            },
            {
                title: "全部",
                msg:"你的作品最多19个字",
                icon:"/images/tab/img_doctor.png",
                time:"30分钟前"
            },
        ]
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    },
    toConfirmOrder: function(e){
        wx.navigateTo({url:"/pages/orderConfirm/index"})
    }
})
