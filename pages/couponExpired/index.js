//index.js
const util = require('../../utils/util.js')
const app = getApp()
var register = require('../../refreshview/refreshLoadRegister.js');
const network = require('../../utils/network.js')
Page({
    data: {
        modalName:'ModalShowCode',
        isOver:false,
        isLoading: false,
        reachBottom: false,
        pageNum: 1,
        pageSize: 20,
        list:[],
    },
    showNavigationBarLoading() {
        if(this.data.loading){//下拉刷新
            return
        }
        this.setData({
            navigationBarLoading: true
        })
    },
    hideNavigationBarLoading() {
        this.setData({
            navigationBarLoading: false
        })
    },
    onShareAppMessage: function (res) {
        console.log('onShareAppMessage')
        console.log(res)
        if (res.from === 'button') {//邀请好友
            console.log('button onShareAppMessage')
        }
        return {
            // title: '吾家W+',//默认当前小程序名称
            path: '/pages/index/index',
            success: function (res) {
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
        register.register(this);
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
        network.requestGet('/v1/experienceActivity/experienceCodeInvalidList',
            {
                pageNum: that.data.pageNum,
                pageSize: that.data.pageSize,
            },
            function (data) {
                if (that.data.pageNum == 1) {
                    that.data.list = []
                }
                that.data.list.push.apply(that.data.list, data.content);
                that.setData({
                    list: that.data.list,
                    isLoading: false,
                })
                if (data.content && data.content.length >= that.data.pageSize) {
                    that.data.pageNum++
                    that.data.isOver = false
                } else {
                    that.data.isOver = true
                }
                register&&register.loadFinish(that,true)
            },
            function (msg) {
                that.setData({
                    isLoading: false,
                })
                register&&register.loadFinish(that,false)
            }
        )
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
    toMyCoupon(e){
        wx.redirectTo({
            url: '/pages/myCoupon/index'
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null,
        })
        wx.navigateBack({
            delta:1,
        })
    },
})
