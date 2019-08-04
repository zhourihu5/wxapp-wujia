//index.js
const app = getApp();
const network = require('../../utils/network.js')
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        apiData: null,
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

    },
})
