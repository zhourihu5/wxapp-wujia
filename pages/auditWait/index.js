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
        console.log('页面栈')
        var pages=getCurrentPages()
        console.log(pages)
        if(pages.length>1){
            this.setData({
                isBack:true
            })
        }
    },
    onShow() {
    },
})
