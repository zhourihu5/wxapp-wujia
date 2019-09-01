const network = require('../../utils/network.js')
const app = getApp()
Page({
    data: {
        apiData: null,
        apiPayOrderData:null,
        modalName: null,
        myAddress: null,//收货地址
        isClicked:false,
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
    onLoad(query) {
        console.log("接收参数",query)
        if(true){//todo test
            return;
        }
        if(query&&query.scene){
            const scene = decodeURIComponent(query.scene)
            console.log('scene',scene)
            if(scene){
               this.reLogin(scene)
                return
            }
        }


        let id = query.id
        // if(true){
        //     return
        // }
       this.loadData(id)

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
    loadData(id){
        let that = this
        network.requestGet('/v1/activity/isOrder', {activityId: id}, function (data) {
            that.setData({
                apiData: data,
                myAddress: data.address,
            })
        }, function (msg) {

        })
    },

    toAddArr(e) {
        this.hideModal(e)
        wx.navigateTo({
            url: "/pages/myAdress/index",
        })
    },
    toPay(e) {
        if (!this.data.myAddress) {
            this.showModal()
            return
        }
        var that = this
        if(that.data.isClicked){
            return;
        }
        that.data.isClicked=true
        network.requestPost('/v1/order/saveOrder', {
            activityId: that.data.apiData.id,
            deliveryUname: that.data.myAddress.name,
            deliveryUphone: that.data.myAddress.phone,
            deliveryAddress:that.data.myAddress.communtityName+that.data.myAddress.address,
            // deliveryArea: that.data.myAddress.address,
            commodityId: that.data.apiData.commodity.id,

        }, function (data) {
            that.data.isClicked=false
            app.orderChanged=true
            that.data.apiPayOrderData=data

            // var random=Math.round(Math.random()*10)
            // if(random>7){//todo test for random payorder
            //     that.payOrder();//todo just for test,please delete it if online
            //     console.log('随机支付了')
            // }else {
            //     console.log('随机未支付')
            // }
            that.wxPay()
        }, function (msg) {
            that.data.isClicked=false
        })


    },
    wxPay(){//获取微信支付参数
        var that=this
        network.requestPost(
            '/wx/wxPay',
            {
                id:that.data.apiPayOrderData.id,
                code:that.data.apiPayOrderData.code,
                activityId: that.data.apiData.id,
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
                        that.payOrder()
                    },
                    fail(res) {

                    }
                })
        },function (msg) {

        })
    },
    payOrder(){//修改订单状态
        var that=this
        network.requestPost('/v1/order/payOrder',{id:that.data.apiPayOrderData.id},function (data) {
            app.activityChanged=true
            wx.redirectTo({url: "/pages/paySuccess/index?id="+that.data.apiPayOrderData.id})
        },function (msg) {

        })
    },
    showModal() {
        this.setData(
            {
                modalName: 'ModalAddaddr',
            }
        )
    },
    hideModal(e) {
        this.setData(
            {
                modalName: null,
            }
        )
    },
    toCouponDiscountPlat(e){
        wx.navigateTo({
            url:'/pages/discountCouponPlat/index',
        })
    },
    toCouponDiscountAct(e){
        wx.navigateTo({
            url:'/pages/discountCouponAct/index',
        })
    },

});