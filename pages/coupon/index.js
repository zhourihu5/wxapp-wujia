//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var register = require('../../refreshview/refreshLoadRegister.js');
const app = getApp();
Page({
    data: {
        lowerThreshold: util.lowerThreshold(),
        list: [],
        isLoading: true,
        isOver: false,
        reachBottom: false,
    },
    customData: {
        pageNum: 1,
        pageSize: 20,

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
        this.customData.pageNum=1
        this.setData({
            isOver: false,
            reachBottom: false,
        });
        this.loadData();
    },
    onLoad: function () {
        register.register(this);
        this.loadData()
    },
    toCouponDetail(e) {
        var index=e.currentTarget.dataset.index
        let id =this.data.list[index].id;
        // let id=1
        wx.navigateTo({url: '/pages/couponDetail/index?id=' + id})
    },
    loadData() {
        var that = this
        if (that.data.isOver) {
            return
        }
        that.setData({
            isLoading: true,
        })
        network.requestGet('/v1/experienceActivity/list',
            {
                pageNum: that.customData.pageNum,
                pageSize: that.customData.pageSize,
                community:app.communtityId
            },
            function (data) {
                if (that.customData.pageNum == 1) {
                    that.data.list = []
                }
                that.data.list.push.apply(that.data.list, data.content);
                that.setData({
                    list: that.data.list,
                    isLoading: false,
                })
                if (data.content && data.content.length >= that.customData.pageSize) {
                    that.customData.pageNum++
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

})
