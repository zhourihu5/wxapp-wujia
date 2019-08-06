//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {},
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
    onShow() {
    },
    onLoad: function () {
    },

})
