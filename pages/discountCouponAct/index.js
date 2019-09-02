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
    //下拉刷新数据
    refresh:function(){
        this.data.pageNum=1
        this.setData({
            isOver: false,
            reachBottom: false,
        });
        this.loadData();
    },
    onLoad() {
        register.register(this)
        this.loadData()
    },

    scrolltolower(e) {
        console.log("scrolltolower")
        var that = this
        that.setData({
            reachBottom: true
        })
        if (that.data.isLoading) {
            return
        }
        this.loadData()
    },
    loadData() {
        var that = this
        if (that.data.isOver) {
            return
        }
        that.setData({
            isLoading: true,
        })
        network.requestGet('/v1/coupon/couponCodeList',
            {
                pageNum: that.data.pageNum,
                pageSize: that.data.pageSize,
                status: '1,2',//0 正常，'1，2'失效的
                type: 1,//1 平台 2活动
            },
            function (data) {
                if (that.data.pageNum == 1) {
                    that.data.list = []
                }
                that.data.list.push.apply(that.data.list, data.content);

                if (data.content && data.content.length >= that.data.pageSize) {
                    that.data.pageNum++
                    that.data.isOver = false
                } else {
                    that.data.isOver = true
                }
                register&&register.loadFinish(that,true)
                that.setData({
                    list: that.data.list,
                    isLoading: false,
                    isOver:that.data.isOver,
                })
            },
            function (msg) {
                that.setData({
                    isLoading: false,
                })
                register&&register.loadFinish(that,false)
            }
        )
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
