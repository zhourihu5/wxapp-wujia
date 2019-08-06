const util = require('../../../utils/util.js')
const network = require('../../../utils/network.js')
const app=getApp()
var interval = null //倒计时函数
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
            }else if(that.data.apiData.status=='2'){
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
        if(prePage.refreshData){
            prePage.refreshData()
            console.log('订单列表页刷新数据')
        }

    },
    goStroll(e){//去逛逛
        wx.redirectTo({url: "/pages/activityMore/index"})
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
        network.requestPost('/v1/order/payOrder',{id:that.data.apiData.id},function (data) {
            app.activityChanged=true
            // wx.navigateTo({url: "/pages/paySuccess/index"})
            wx.redirectTo({url: "/pages/paySuccess/index"})
        },function (msg) {

        })
    },
})
