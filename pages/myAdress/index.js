//index.js
const app = getApp();
const network = require('../../utils/network.js')
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        apiData:null,
    },
    onLoad(option) {

    },
    onShow(){
        this.loadData()
    },
    loadData(){
        var that=this
        network.requestGet('/v1/address/findList',{},function (data) {
            that.setData({
                apiData:data,
            })
        },function (msg) {

        })
    },
    addNewAdress(e){
        wx.navigateTo({url:"/pages/addAdress/index"})
    },
    itemClick(e){
        // var pages=getCurrentPages();
        // var prevPage=pages[pages.length-2];
        // prevPage.setData({
        //     user:'LaternKiwis'
        // })
        var index=e.currentTarget.dataset.index
        app.myAddress=this.data.apiData[index]
    },
    toEdit(e){

    },
})
