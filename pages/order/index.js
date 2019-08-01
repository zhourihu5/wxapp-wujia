//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
const app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        lowerThreshold: util.lowerThreshold(),
        isLoading: true,
        isOver: false,
        tabData: [
            [],
            [],
            [],
            [],
            [],
        ],
        active: 0,
        tabs: [
            {
                title: "全部",
            },
            {
                title: "待付款",
            },
            {
                title: "待收获",
            },
            {
                title: "已收货",
            },
            {
                title: "已过期",
            },
        ],
        pageNum: 1,
        pageSize: 10,

    },
    onShow() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().init()
        }
    },
    onLoad: function () {
        this.loadData()
    },
    loadData() {
        // if(true){
        //     this.mockData()
        //     return;
        // }


        var that = this
        if (that.data.isOver) {
            return
        }
        that.setData({
            isLoading: true,
        })
        network.requestGet('/v1/order/findList', {
            pageNum: that.data.pageNum,
            pageSize: that.data.pageSize,
        }, function (data) {
            if (that.data.pageSize == 1) {
                that.data.tabData[that.data.active] = []
            }
            that.data.tabData[that.data.active].push.apply(that.data.tabData[that.data.active], data.content);
            that.setData({
                tabData:that.data.tabData,
                isLoading: false,
            })
            that.data.pageSize++
        }, function (msg) {

        })
    },
    mockData() {
        var that = this
        if (that.data.isOver) {
            return
        }
        that.setData({
            isLoading: true,
        })
        if (that.data.pageSize == 1) {
            that.data.tabData[that.data.active] = []
        }
        var data=[]
        var i=0
        for(i=0;i<that.data.pageSize;i++){
            data[i]=(that.data.pageNum-1)*that.data.pageSize+i
        }
        console.log("mockData")
        console.log(data)
        that.data.tabData[that.data.active].push.apply(that.data.tabData[that.data.active], data);
        console.log("push后的数据")
        console.log(that.data.tabData)
        that.setData({
            tabData:that.data.tabData,
            isLoading: false,
         })
        that.data.pageSize++
    },
    onChange(event) {
        var that = this
        that.data.active = event.detail.index
        if(that.data.tabData[that.data.active].length<=0){
            that.loadData()
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
        if(this.data.isLoading){
            return
        }
        this.loadData()
    }

})
