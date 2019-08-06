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
        if(getCurrentPages().length>1){
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
