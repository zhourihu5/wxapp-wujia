const network = require('../../utils/network.js')
const app = getApp()
Page({
    data: {
        apiData: null,
        apiPayOrderData:null,
        modalName: null,
        myAddress: null,//收货地址
        steps: [
            {
                text: '参与活动',
                desc: ''
            },
            {
                text: '团购满减',
                desc: ''
            },
            {
                text: '团购截至',
                desc: ''
            },

        ]
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
    onLoad(query) {
        console.log("接收参数")
        console.log(query)
        let that = this
        let id = query.id
        network.requestGet('/v1/activity/isOrder', {activityId: id}, function (data) {
            that.setData({
                apiData: data,
                myAddress: data.address,
            })
        }, function (msg) {

        })

    },
    // onShow(){
    //   if(this.data.apiData&& !this.data.apiData.address){
    //     this.data.apiData.address=app.myAddress
    //   }
    //
    // },
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
        network.requestPost('/v1/order/saveOrder', {
            activityId: that.data.apiData.id,
            deliveryUname: that.data.myAddress.name,
            deliveryUphone: that.data.myAddress.phone,
            deliveryArea: that.data.myAddress.address,
            commodityId: that.data.apiData.commodity.id,

        }, function (data) {
            app.orderChanged=true
            that.data.apiPayOrderData=data

            var random=Math.round(Math.random()*10)
            if(random>6){//todo test for random payorder
                that.payOrder();//todo just for test,please delete it if online
                console.log('随机支付了')
            }else {
                console.log('随机未支付')
            }

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


        }, function (msg) {

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
    }
});