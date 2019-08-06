//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        isBack:false
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
