//index.js
const util = require('../../utils/util.js')
const app = getApp()
var register = require('../../refreshview/refreshLoadRegister.js');
const network = require('../../utils/network.js')
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        modalName:'ModalShowCode',
        isOver:true,//todo test
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
        // register.register(this);
        console.log(pages)
        if (pages.length > 1) {
            this.setData({
                isBack: true
            })
        }
    },
    toMyCoupon(e){
        wx.redirectTo({
            url: '/pages/myCoupon/index'
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null,
        })
        wx.navigateBack({
            delta:1,
        })
    },
    takeCoupon(e){
        //todo

        this.setData({
            modalName: 'ModalTakeCouponSuccess',
        })
    },
})
