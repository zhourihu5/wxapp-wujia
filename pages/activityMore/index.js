//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
const app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        lowerThreshold: util.lowerThreshold(),
        list: [],
        isLoading: true,
        reachBottom: false,
    },
    customData: {
        pageNum: 1,
        pageSize: 3,
        isOver: false,
    },
    onLoad: function () {
        this.loadData()
    },
    goBuy(e) {
        var index=e.currentTarget.dataset.index
        let id =this.data.list[index].id;
        if(this.data.list[index].isJoin==0){
            wx.navigateTo({url: '/pages/goodsDetail/index?id=' + id})
        }else {
            wx.navigateTo({url: '/pages/goodsDetail1/index?id=' + id})
        }
    },
    loadData() {
        var that = this
        if (that.customData.isOver) {
            return
        }
        that.setData({
            isLoading: true,
        })
        network.requestGet('/v1/activity/findAll',
            {
                pageNum: that.customData.pageNum,
                pageSize: that.customData.pageSize,
            },
            function (data) {
                if (that.customData.pageNum == 1) {
                    that.data.list = data.content
                } else {
                    that.data.list.push.apply(that.data.list, data.content);
                }
                that.setData({
                    list: that.data.list,
                    isLoading: false,
                })
                console.log('数组长度')
                console.log(data.content.length)
                if (data.content && data.content.length >= that.customData.pageSize) {
                    that.customData.pageNum++
                    that.customData.isOver = false
                } else {
                    that.customData.isOver = true
                }
                console.log('list 数据')
                console.log(that.data.list)
            },
            function (msg) {
                that.setData({
                    isLoading: false,
                })
            }
        )
    },
    scrolltoupper(e) {
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
