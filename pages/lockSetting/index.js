//index.js
const util = require('../../utils/util.js')
const app = getApp()
var register = require('../../refreshview/refreshLoadRegister.js');
const network = require('../../utils/network.js')
Page({
    data: {
        isBack: false,
        CustomBar: app.globalData.CustomBar,
    },
    showNavigationBarLoading() {
        if(this.data.loading){//下拉刷新
            return
        }
        this.setData({
            navigationBarLoading: true
        })
    },
    hideNavigationBarLoading() {
        this.setData({
            navigationBarLoading: false
        })
    },
    onShareAppMessage: function (res) {
        console.log('onShareAppMessage')
        console.log(res)
        if (res.from === 'button') {//邀请好友
            console.log('button onShareAppMessage')
        }
        return {
            // title: '吾家W+',//默认当前小程序名称
            path: '/pages/index/index',
            success: function (res) {
                console.log('onShareAppMessage success')
                console.log(res)
            }
        }
    },
    onLoad() {
        console.log('页面栈')
        register.register(this);
        var pages = getCurrentPages()
        console.log(pages)
        if (pages.length > 1) {
            this.setData({
                isBack: true
            })
        }
    },
    onShow() {
        // wx.onAppHide(this.onAppHide)
    },
    // onAppHide(){
    //     console.log('应用切入后台')
    //     wx.reLaunch({//can not relaunch in background
    //         url:'/pages/index/index',
    //     })
    // },
    // navigateBack(){
    //     this.data.isNaviback=true
    //     wx.navigateBack({
    //         delta: 1
    //     });
    // },
    // onHide(){
    //     // wx.offAppHide(this.onAppHide)
    //     console.log('auditWait onHide')
    //     if(this.data.isNaviback){
    //         return
    //     }
    //     wx.reLaunch({//can not relaunch in background
    //         url:'/pages/index/index',
    //     })
    // },
})
