//index.js
const app = getApp();
const network = require('../../utils/network.js')
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        apiData: null,
        currentAddr:null,
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
    onLoad(option) {
        this.loadData()
    },
    notifyAddressChanged() {
        this.loadData()
    },
    loadData() {
        var that = this
        network.requestGet('/v1/address/findList', {}, function (data) {
            that.setData({
                apiData: data,
            })
        }, function (msg) {

        })
    },
    addNewAdress(e) {
        wx.navigateTo({url: "/pages/addAdress/index"})
    },
    itemClick(e) {
        var index = e.currentTarget.dataset.index
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
            myAddress: this.data.apiData[index],//收货地址
        })
        wx.navigateBack({
            delta: 1,
        })
        // app.myAddress=this.data.apiData[index]

    },
    toEdit(e) {
        console.log('编辑收货地址按钮点击')
        let index=e.currentTarget.dataset.index
        this.data.currentAddr=this.data.apiData[index]
        console.log(this.data.currentAddr)
        wx.navigateTo({url: "/pages/editAdress/index"})
        console.log('跳转后')
    },
})
