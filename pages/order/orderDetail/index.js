const util = require('../../../utils/util.js')
const network = require('../../../utils/network.js')
const app=getApp()
var interval = null //倒计时函数
Page({
    data: {
        apiData:null,
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
            // title: '吾家小智',//默认当前小程序名称
            path: '/pages/index/index' ,
            success: function(res) {
                console.log('onShareAppMessage success')
                console.log(res)
            }
        }
    },
    onLoad: function (options) {
        var pages=getCurrentPages()
        console.log('getCurrentPages')
        console.log(pages)
        let id=options.id;
        var that=this
        network.requestGet('/v1/order/findOrderDetail',{orderId:id},function (data) {
            that.setData({
                apiData:data,
            })
        },function (msg) {

        })
    },
    onShow(){
        this.setTimeRemain()
    },
    onHide(){
        interval && clearInterval(interval)
        interval=null
    },
    setTimeRemain: function () {
        if(interval){
            clearInterval(interval)
            interval=null
        }

        var that = this
        var endDate=null
        interval = setInterval(function () {
            if(!that.data.apiData){
                return;
            }
            if(that.data.apiData.status=='1'){
                that.data.apiData.remainTime=util.calcRemainTime(that.data.apiData.payEndDate)
                that.setData({
                    apiData:that.data.apiData
                })
            }else if(that.data.apiData.status=='2'||that.data.apiData.status=='5'){
                if(!endDate){
                    endDate=new Date(Date.parse(that.data.apiData.activity.endDate.replace(/-/g, "/")));
                    endDate.setTime(endDate.getTime()+that.data.apiData.activity.deliveryHour*3600*1000)
                }
                that.data.apiData.remainTime=util.calcRemainTime(endDate)
                that.setData({
                    apiData:that.data.apiData
                })
            }
            else {
                clearInterval(interval)
                interval=null
                return;
            }


        }, 1000)
    },

    cancelOrder(e){//todo 取消订单
        var that=this
        var id=this.data.apiData.id
        network.requestPost('/v1/order/cancelOrder',{id:id},function (data) {
            app.showToast('订单已取消')
            that.refreshPrePageData()
            wx.navigateBack({
                delta:1
            })
        },function (msg) {

        })
    },
    refreshPrePageData(){
        var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
        // var currentPage  = pages[pages.length - 1]  //当前界面
        var prePage = pages[pages.length - 2]  //上一个界面
        if(prePage.refresh){
            prePage.refresh()
            console.log('订单列表页刷新数据')
        }

    },
    goStroll(e){//去逛逛
        if(!util.navibackTo("/pages/activityMore/index")){
            wx.redirectTo({url: "/pages/activityMore/index"})
        }

    },
    confirmReceive(e){//TODO 确认收货
        var that=this
        var id=that.data.apiData.id
        network.requestPost('/v1/order/receiveOrder',
            {id:id},function (data) {
            that.refreshPrePageData()
            app.showToast('确认成功')
            wx.navigateBack({
                delta:1
            })
        },function (msg) {

        })
    },
    toPay(e){
        var that=this
        var orderData=that.data.apiData
        if(util.calcRemainTime(orderData.payEndDate)=='00:00:00'){
            app.showToast('订单已过期，请重新下单')
            return
        }
        that.wxPay(orderData)

    },
    payOrder(orderData){//修改订单状态
        var that=this
        network.requestPost('/v1/order/payOrder',{id:orderData.id},function (data) {
            app.activityChanged=true
            wx.redirectTo({url: "/pages/paySuccess/index?id="+orderData.id})
        },function (msg) {

        })
    },
    wxPay(orderData){//获取微信支付参数
        var that=this
        network.requestPost(
            '/wx/wxPay',
            {
                id:orderData.id,
                code:orderData.code,
                activityId: orderData.activity.id,
            },
            function (data) {

                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: 'MD5',
                    paySign: data.paySign,
                    success(res) {
                        console.log('微信支付成功')
                        console.log(res)
                        that.payOrder(orderData)
                    },
                    fail(res) {

                    }
                })
            },function (msg) {

            })
    },
})
