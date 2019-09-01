//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
const app = getApp();
var register = require('../../refreshview/refreshLoadRegister.js');
var interval = null //倒计时函数
var requestTask=null
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        lowerThreshold: util.lowerThreshold(),
        customTabBarHeight:util.customTabBarHeight(),
        active: 0,
        modalName:null,
        tabs: [
            {
                title: "平台优惠券",
                status:null,
                isOver:true,//todo test
                isLoading: false,
                reachBottom:false,
                scrolling:false,
                isUpper:true,
                pageNum: 1,
                data:[
                    1,
                    2,
                    3,
                ],
            },
            {
                title: "活动优惠券",
                status:1,
                isOver:true,//todo test
                isLoading: false,
                reachBottom:false,
                scrolling:false,
                isUpper:true,
                pageNum: 1,
                data:[
                    1,
                    2,
                    3,
                ],
            },
        ],
        windowHeight:app.globalData.windowHeight,
        pageSize: 20,
        tabLineWidth:util.rpxToPx(28),

    },
    showNavigationBarLoading(){
        if(this.data.loading){//下拉刷新
            return
        }
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
    onShow() {
    },

    onHide(){
        console.log('order onHide')
        interval && clearInterval(interval)
        interval=null
    },
    onLoad: function () {
        register.register(this)
        this.loadData()
    },
    onUnload(){
        requestTask&&requestTask.abort()
        console.log('onUnload requestTask.abort')
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
    loadData() {
        // var that = this
        // var active=that.data.active;
        // if (that.data.tabs[active].isOver) {
        //     return
        // }
        // that.data.tabs[active].isLoading=true
        // that.setData({
        //     tabs: that.data.tabs,
        // })
        //
        // var paramData={
        //     communtityCode:app.communtityCode,
        //     pageNum: that.data.tabs[active].pageNum,
        //     pageSize:that.data.pageSize,
        // }
        // requestTask&&requestTask.abort()
        // requestTask=network.requestGet('/v1/apply/accessRecords',paramData,function (data) {
        //     that.data.tabs[active].isLoading=false
        //     register&&register.loadFinish(that,true)
        //     if (that.data.tabs[active].pageNum == 1) {
        //         that.data.tabs[active].data = []
        //     }
        //     that.data.tabs[active].data.push.apply(that.data.tabs[active].data, data.ItemList);
        //     if(data.Search&&data.Search.RecordCount>that.data.tabs[active].data.length){
        //         that.data.tabs[active].pageNum++
        //         that.data.tabs[active].isOver=false
        //     }else {
        //         that.data.tabs[active].isOver=true
        //     }
        //     that.setData({
        //         tabs: that.data.tabs,
        //         imgUrl:data.imgUrl,
        //     })
        //
        //
        // }, function (msg) {
        //     register&&register.loadFinish(that,false)
        //     that.data.tabs[active].isLoading=false
        // })


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
        var scrolling=this.data.tabs[that.data.active].scrolling
        var isUpper=this.data.tabs[that.data.active].isUpper
        this.data.scrolling = scrolling;
        this.data.isUpper =isUpper;
    },
    scrollP(e){
        var tabIndex=e.currentTarget.dataset.index
        this.data.tabs[tabIndex].isUpper=false
        this.data.tabs[tabIndex].scrolling=true
        if(this.scroll){
            this.scroll(e)
        }
    },
    upperP(e){
        var tabIndex=e.currentTarget.dataset.index
        this.data.tabs[tabIndex].isUpper=true
        this.data.tabs[tabIndex].scrolling=false
        if(this.upper){
            this.upper(e)
        }
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
    },
    toExpiredMore(e){
        var index=e.currentTarget.dataset.index
        if(index==0){
            wx.navigateTo({
                url:'/pages/discountCouponExpiredPlat/index'
            })
        }else {
            wx.navigateTo({
                url:'/pages/discountCouponExpiredAct/index'
            })
        }
    },
})
