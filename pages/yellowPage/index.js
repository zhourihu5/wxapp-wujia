//index.js
//获取应用实例
const app = getApp()
const network = require('../../utils/network.js')
Page({
    data: {
        apiData: null,
        callPhone: null,
        modalName: null,
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
    makePhoneCall(e) {
        this.hideModal();
        const that = this
        wx.makePhoneCall({
            phoneNumber: that.data.callPhone
        })
    },
    showModal(e) {
        this.setData({
            modalName: 'ModalCallPhone',
            callPhone: e.currentTarget.dataset.phone,
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null,
            // callPhone:null,
        })
    },
    onLoad: function () {
        var that = this
        network.requestGet('/v1/communtityInfo/findList', {communtityId: app.communtityId}, function (data) {
            that.setData({
                apiData: data,
            })
        }, function (msg) {

        })
    },
})
