//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        isBack:false
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
    onLoad(){
        var pages=getCurrentPages()
        console.log('页面栈')
        console.log(pages)
        if(pages.length>1){
            this.setData({
                isBack:true
            })
        }
    },
    onShow() {
    },
    onLoad: function () {
    },
})
