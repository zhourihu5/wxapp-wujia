//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        failReason: null,
    },
    onShow() {
    },
    onLoad: function (options) {
        var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
        // var currentPage  = pages[pages.length - 1]  //当前界面
        var prePage = pages[pages.length - 2]  //上一个界面
        this.setData({
            failReason: prePage.data.failReason,
        })
        prePage.data.failReason = null
    },
    onClick(e) {
        wx.redirectTo({url: '/pages/neibourList/index'})
    }
})
