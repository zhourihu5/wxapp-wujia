//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
Page({
    data: {
        apiData:null,
        checked:null,
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
    onLoad(query) {
        let activityId=query.activityId
        var pages=getCurrentPages()
        var prePage=pages[pages.length-2]
        if(prePage.data.couponAct){
            this.setData({
                checked:prePage.data.couponAct.id,
            })
        }
        var that=this
        network.requestGet('/v1/coupon/couponChangeList',
            {
                activityId: activityId,
                // status: '1,2',//0 正常，'1，2'失效的
                type: 2,//1 平台 2活动
            },
            function (data) {
                that.setData({
                    apiData:data,
                })
            },
            function (msg) {

            }
        )
    },
    itemClicked(e){
       let index=  e.currentTarget.dataset.index
        this.setData({
            checked:this.data.apiData.yesList[index].id,
        })
        var pages=getCurrentPages()
        var prePage=pages[pages.length-2]
        prePage.data.couponAct=this.data.apiData.yesList[index]
        prePage.setData({
            // couponPlatText: "-￥${prePage.data.couponPlat.money}",
            couponActText: `-￥${prePage.data.couponAct.money}`,
        })
        wx.navigateBack({
            delta:1,
        })
    }

})
