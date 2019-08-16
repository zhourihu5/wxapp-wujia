//index.js
const util = require('../../utils/util.js')
const app = getApp()
var register = require('../../refreshview/refreshLoadRegister.js');
Page({
    data: {
        failReason: null,
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
    onShareAppMessage: function(res) {
        console.log('onShareAppMessage')
        console.log(res)
        if (res.from === 'button') {//邀请好友
            console.log('button onShareAppMessage')
        }
        return {
            // title: '吾家W+',//默认当前小程序名称
            path: '/pages/index/index' ,
            success: function(res) {
                console.log('onShareAppMessage success')
                console.log(res)
            }
        }
    },
    onShow() {
    },
    //下拉刷新数据
    refresh:function(){
        var that=this
        register&&register.loadFinish(that,true)
        wx.reLaunch({
            url:'/pages/index/index',
        })
    },
    onLoad: function (options) {
        register.register(this);
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
