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
    nextStep() {
        this.setData({
            active: ++this.data.active % 4
        });
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
            that.data.apiPayOrderData=data

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


        }, function (msg) {

        })


        // wx.navigateTo({url:"/pages/paySuccess/index"})
    },
    payOrder(){//修改订单状态
        var that=this
        network.requestPost('/v1/order/payOrder',{id:that.data.apiPayOrderData.id},function (data) {
            // wx.navigateTo({url: "/pages/paySuccess/index"})
            wx.redirectTo({url: "/pages/paySuccess/index"})
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