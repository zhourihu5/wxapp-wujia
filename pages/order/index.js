//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
const app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        lowerThreshold: util.lowerThreshold(),
        active: 0,
        modalName:null,
        callPhone:null,
        tabs: [
            {
                title: "全部",
                status:null,
                isOver:false,
                isLoading: false,
                reachBottom:false,
                pageNum: 1,
                data:[],
            },
            {
                title: "待付款",
                status:1,
                isOver:false,
                isLoading: false,
                reachBottom:false,
                pageNum: 1,
                data:[],
            },
            {
                title: "待收获",
                status:2,
                isOver:false,
                isLoading: false,
                reachBottom:false,
                pageNum: 1,
                data:[],
            },
            {
                title: "已收货",
                status:3,
                isOver:false,
                isLoading: false,
                reachBottom:false,
                pageNum: 1,
                data:[],
            },
            {
                title: "已过期",
                status:4,
                isOver:false,
                isLoading: false,
                reachBottom:false,
                pageNum: 1,
                data:[],
            },
        ],
        pageSize: 10,

    },
    onShow() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().init()
        }
    },
    onLoad: function () {
        this.loadDataIfNeeded()
    },
    loadData() {
        var that = this
        var active=that.data.active;
        if (that.data.tabs[active].isOver) {
            return
        }
        that.data.tabs[active].isLoading=true
        that.setData({
            tabs: that.data.tabs,
        })
        var paramData={
            // status:that.data.tabs[active].status,
            pageNum: that.data.tabs[active].pageNum,
            pageSize:that.data.pageSize,
        }
        if(that.data.tabs[active].status){
            paramData.status=that.data.tabs[active].status
        }
        network.requestGet('/v1/order/findList', paramData, function (data) {
            if (that.data.tabs[active].pageSize == 1) {
                that.data.tabs[active].data = []
            }
            that.data.tabs[active].data.push.apply(that.data.tabs[active].data, data.content);
            that.data.tabs[active].isLoading=false
            if(data.content.length>=that.data.pageSize){
                that.data.tabs[active].pageNum++
                that.data.tabs[active].isOver=false
            }else {
                that.data.tabs[active].isOver=true
            }
            that.setData({
                tabs: that.data.tabs,
            })
        }, function (msg) {
            that.data.tabs[active].isLoading=false
        })
    },
    onChangeTab(event) {
        var that = this
        that.data.active = event.detail.index
        that.setData({
            active:event.detail.index
        })
        if (that.data.tabs[that.data.active].data.length <= 0) {
            that.loadDataIfNeeded()
        }

    },
    itemClicked(e){
        var index=e.currentTarget.dataset.index
        var id=this.data.tabs[this.data.active].data[index].id
        wx.navigateTo({
            url:"/pages/order/orderDetail/index?id="+id
        })
    },
    goStroll(e){//去逛逛
        wx.navigateTo({url: "/pages/activityMore/index"})
    },
    askDeliver(e){//联系送货人
        var phone= e.currentTarget.dataset.phone
        this.setData({
            modalName:'ModalCallPhone',
            callPhone:phone,
        })
    },
    makePhoneCall(e) {
        this.hideModal(e);
        const that = this
        wx.makePhoneCall({
            phoneNumber: that.data.callPhone
        })
    },
    hideModal(e){
        this.setData({
            modalName:null,
        })
    },
    toPay(e){//todo 立即付款
        var that=this
        let id=e.currentTarget.dataset.id
        wx.requestPayment({
            timeStamp: '',
            nonceStr: '',
            package: '',
            signType: 'MD5',
            paySign: '',
            success(res) {
                that.payOrder(id)
            },
            fail(res) {

            }
        })
    },
    payOrder(id){//修改订单状态
        var that=this
        network.requestPost('/v1/order/payOrder',{id:id},function (data) {
            // wx.navigateTo({url: "/pages/paySuccess/index"})
            wx.redirectTo({url: "/pages/paySuccess/index"})
        },function (msg) {

        })
    },

    onPullDownRefresh: function () {
        // Do something when pull down.
        console.log('onPullDownRefresh')

    },
    onReachBottom: function () {
        // Do something when page reach bottom.
        console.log('onReachBottom')
    },
    scrolltoupper: function (e) {
        // console.log("scrolltoupper")
    },
    scrolltolower(e) {
        console.log('scrolltolower')
        this.data.tabs[this.data.active].reachBottom=true
        this.setData({
            tabs:this.data.tabs
        })
        this.loadDataIfNeeded()
    },
    loadDataIfNeeded(){
        if (this.data.tabs[this.data.active].isLoading) {
            return
        }
        this.loadData()
    }

})
