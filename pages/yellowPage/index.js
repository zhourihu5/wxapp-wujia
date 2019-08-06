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
