const util = require('../../../utils/util.js')
const network = require('../../../utils/network.js')
const app=getApp()
Page({
    data: {
        apiData:null,
    },
    onLoad: function (options) {
        let id=options.id;
        var that=this
        network.requestGet('/v1/order/findOrderDetail',{orderId:id},function (data) {
            that.setData({
                apiData:data,
            })
        },function (msg) {

        })
    },
    cancelOrder(e){//todo 取消订单
        var id=this.data.apiData.id
        network.requestPost('/v1/order/cancelOrder',{id:id},function (data) {
            app.showToast('订单已取消')
            wx.navigateBack({
                delta:1
            })
        },function (msg) {

        })
    },
    goStroll(e){//去逛逛
        wx.redirectTo({url: "/pages/activityMore/index"})
    },
    confirmReceive(e){//TODO 确认收货
        network.requestPost('/v1/order/receiveOrder',
            {id:id},function (data) {
            app.showToast('确认成功')
            wx.navigateBack({
                delta:1
            })
        },function (msg) {

        })
    },
    toPay(e){
        var that=this

        that.payOrder();//todo just for test,please delete it if online

        wx.requestPayment({
            timeStamp: '',
            nonceStr: '',
            package: '',
            signType: 'MD5',
            paySign: '',
            success(res) {
                that.payOrder()
            },
            fail(res) {

            }
        })
    },
    payOrder(){//修改订单状态
        var that=this
        network.requestPost('/v1/order/payOrder',{id:that.data.apiPayOrderData.id},function (data) {
            // wx.navigateTo({url: "/pages/paySuccess/index"})
            wx.redirectTo({url: "/pages/paySuccess/index"})
        },function (msg) {

        })
    },
})
