const util = require('../../../utils/util.js')
const network = require('../../../utils/network.js')
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

    },
    goStroll(e){//去逛逛 todo 问产品要跳哪

    },
    confirmReceive(e){//TODO 确认收货

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
