//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
Page({
    data: {
        apiData:null,
        reachBottom:false,
        isLoading:false,
        orderId:null,
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
    onLoad: function (options) {
        this.data.orderId=options.id
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

    },
    goBuy(e) {
        var index=e.currentTarget.dataset.index
        let id =this.data.apiData[index].id;
        if(this.data.apiData[index].isJoin==1){
            wx.redirectTo({url: '/pages/goodsDetail1/index?id=' + id})
        }else {
            wx.redirectTo({url: '/pages/goodsDetail/index?id=' + id})
        }
    },
    toOrderDetail(e){
        wx.redirectTo({url: '/pages/order/orderDetail/index?id=' +this.data.orderId})
    },
    goStroll(e){
        wx.redirectTo({url: '/pages/activityMore/index'})
    },
})
