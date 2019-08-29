const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
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
            // title: '吾家W+',//默认当前小程序名称
            path: '/pages/index/index' ,
            success: function(res) {
                console.log('onShareAppMessage success')
                console.log(res)
            }
        }
    },
    onLoad: function (query) {
        console.log("接收参数",query)
        if(query&&query.scene){
            const scene = decodeURIComponent(query.scene)
            console.log('scene',scene)
            if(scene){
                this.reLogin(scene)
                return
            }
        }
        let id=query.id;
        if(id){
           this.loadData(id)
        }

    },
    loadData(id){
        var that=this
        network.requestGet('/v1/order/findOrderDetail',{orderId:id},function (data) {
            that.setData({
                apiData:data,
            })
        },function (msg) {

        })
    },
    reLogin(id){
        this.navigateBack=function(){
            wx.reLaunch({
                url: '/pages/index/index',
            })
        }
        var that=this
        wx.login({
            success(res) {
                // register && register.loadFinish(that, true)
                if (res.code) {
                    console.log('微信登录成功')
                    console.log(res)
                    //发起网络请求
                    network.requestGet('/wx/binding/checkBinding', {
                        code: res.code
                    }, function (data) {
                        // that.setData({
                        //     communtityName: data.communtityName,
                        //     apiData: data,
                        // })
                        app.token = data.token
                        if(!app.communtityId){
                            try {
                                app.communtityId = data.communtityList[0].id
                                app.communtityCode = data.communtityList[0].code
                            } catch (e) {
                            }
                        }

                        // that.customData.openid = data.openid
                        if (data.userInfo) {
                            app.nickName = data.userInfo.nickName
                            app.userName = data.userInfo.userName
                            app.wxCover = data.userInfo.wxCover
                            app.fid = data.userInfo.fid
                            if (data.applyLock) {
                                if (data.applyLock.status == '0') {//待审核
                                    wx.redirectTo({url: '/pages/auditWait/index'})
                                    return;
                                } else if (data.applyLock.status == '2') {//不通过
                                    app.failReason = data.applyLock.remark
                                    wx.redirectTo({url: '/pages/auditFail/index'})
                                    return
                                }
                            } else if ('0' == data.isBindingFamily) {
                                wx.redirectTo({url: '/pages/neibourList/index'})
                                return;
                            }
                        }else {
                            wx.reLaunch({
                                url: '/pages/index/index',
                            })
                            return;
                        }
                        that.loadData(id)
                    }, function (msg) {
                        // register && register.loadFinish(that, false)
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
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
        var timeRemain=null
        var second=null
        var hourMinute=null
        interval = setInterval(function () {
            if(!that.data.apiData){
                return;
            }
            if(that.data.apiData.status=='1'){
                timeRemain=util.calcRemainTime(that.data.apiData.payEndDate)
            }else if(that.data.apiData.status=='2'||that.data.apiData.status=='5'){
                if(!endDate){
                    endDate=new Date(Date.parse(that.data.apiData.activity.endDate.replace(/-/g, "/")));
                    endDate.setTime(endDate.getTime()+that.data.apiData.activity.deliveryHour*3600*1000)
                }
                timeRemain=util.calcRemainTime(endDate)
            }
            else {
                clearInterval(interval)
                interval=null
                return;
            }
            var timeArr= timeRemain.split(':')
            second=timeArr[2]
            hourMinute=`${timeArr[0]}:${timeArr[1]}:`
            that.data.apiData.hourMinute=hourMinute
            that.data.apiData.second=second
            that.setData({
                apiData:that.data.apiData
            })

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
