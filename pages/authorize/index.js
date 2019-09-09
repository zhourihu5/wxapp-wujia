//index.js
const util = require('../../utils/util.js')
const app = getApp()
var register = require('../../refreshview/refreshLoadRegister.js');
const network = require('../../utils/network.js')
Page({
    data: {
       radioChecked:false,
        isShowingModal:false,
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
    getPhoneNumber (e) {
        var that=this
        if(!this.data.radioChecked){
            wx.showModal({
                // title:'请先同意用户注册协议',
                showCancel:false,
                content:'请先同意用户注册协议',
                success (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
            return
        }
        console.log('getPhoneNumber e.detail',e.detail)
        if(e.detail.encryptedData){

        }else {

        }
        // console.log(e.detail.iv)
        // console.log(e.detail.encryptedData)
    },
    radioClicked(e){
        this.setData({
            radioChecked:!this.data.radioChecked,
        })
    },
    toLicence(e){
        wx.navigateTo({
            url:'/pages/licence/index'
        })
    }
})
