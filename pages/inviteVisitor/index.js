//index.js
const util = require('../../utils/util.js')
const app = getApp()
const network = require('../../utils/network.js')
Page({
    data: {
        failReason: null,
        canNotShare:true,
        apiData:null,
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
    onShow() {
    },
    onLoad: function (options) {
        var that=this
        network.requestGet('/v1/user/findWxUserInfo',//todo 获取开锁code url
            {},function (data) {
            that.setData({
                apiData:data,
                canNotShare:false,
            })
        },function (msg) {

        })
    },
    //转发
    onShareAppMessage: function(res) {
        console.log('onShareAppMessage')
        console.log(res)
        if (res.from === 'button') {//邀请好友
            console.log('button onShareAppMessage')
            return {
                // title: '吾家小智',//默认当前小程序名称
                path: '/pages/index/index?applyCode=111',//todo 获取开锁code
                success: function (res) {
                    console.log('onShareAppMessage success')
                    console.log(res)
                }
            }
        }
        return {
            // title: '吾家小智',//默认当前小程序名称
            path: '/pages/index/index' ,
            success: function(res) {
                console.log('onShareAppMessage success')
                console.log(res)
            }
        }
    },
    onClick(e) {
        if(this.data.canNotShare){
            app.showToast('数据正在加载中，请稍等')
            return
        }

    }
})
