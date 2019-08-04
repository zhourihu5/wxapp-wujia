//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
Page({
    data: {
        apiData:null,
        reachBottom:false,
        isLoading:false,
    },
    onLoad: function () {
        var that=this
        network.requestGet('/v1/activity/findOtherList',{},function (data) {
            that.setData({
                apiData:data
            })
        },function (msg) {

        })
    },
    navigateBack(){
        wx.navigateBack({//从确认订单那里redirect的，跳过商品详情页回到列表页
            delta: 2
        });
        return true
    },
    bindscrolltolower(e){

    }
})
