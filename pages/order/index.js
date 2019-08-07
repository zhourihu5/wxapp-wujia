//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
const app = getApp();
var register = require('../../refreshview/refreshLoadRegister.js');
var interval = null //倒计时函数
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
                title: "待收货",
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
    onShow() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().init()
        }
        this.setTimeRemain()
        if(app.orderChanged){
            app.orderChanged=false
            this.refreshAllData()
        }
    },
    onHide(){
        interval && clearInterval(interval)
        interval=null
    },
    onLoad: function () {
        register.register(this)
        this.refreshAllData()
    },
    //下拉刷新数据
    refresh:function(){
        this.data.tabs[this.data.active].isOver=false
        this.data.tabs[this.data.active].reachBottom=false
        this.data.tabs[this.data.active].pageNum=1
        this.setData({
            tabs: this.data.tabs,
        });
        this.loadData();
    },
    setTimeRemain: function () {
        if(interval){
            clearInterval(interval)
            interval=null
        }

        var that = this
        var i=0
        var orderData=null
        interval = setInterval(function () {
            for(i=0;i<that.data.tabs[0].data.length;i++){
                orderData=that.data.tabs[0].data[i]
                if(orderData.status=='1'){
                    orderData.remainTime=util.calcRemainTime(orderData.payEndDate)
                    // if(orderData.remainTime=='00:00:00'){
                    //     that.refreshAllData()
                    //     return;
                    // }
                }
            }
            for(i=0;i<that.data.tabs[1].data.length;i++){
                orderData=that.data.tabs[1].data[i]
                if(orderData.status=='1'){
                    orderData.remainTime=util.calcRemainTime(orderData.payEndDate)
                    // if(orderData.remainTime=='00:00:00'){
                    //     that.refreshAllData()
                    //     return;
                    // }
                }
            }
            that.setData({
                tabs:that.data.tabs
            })

        }, 1000)
    },
    refreshAllData(){
        var that = this
        that.setData({
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
                    title: "待收货",
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
        })
        that.loadData()
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
            if (that.data.tabs[active].pageNum == 1) {
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
            register&&register.loadFinish(that,true)
        }, function (msg) {
            that.data.tabs[active].isLoading=false
            register&&register.loadFinish(that,false)
        })
    },
    onChangeTab(event) {
        var that = this
        register&&register.cancel(that)
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
        let index=e.currentTarget.dataset.index
        var orderData=that.data.tabs[that.data.active].data[index]
        if(util.calcRemainTime(orderData.payEndDate)=='00:00:00'){
            app.showToast('订单已过期，请重新下单')
            return
        }

        this.payOrder(id)//todo test
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
            app.activityChanged=true
            // wx.navigateTo({url: "/pages/paySuccess/index?id="+id})
            that.refreshAllData()
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
