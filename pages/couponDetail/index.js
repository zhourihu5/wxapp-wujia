//index.js
const util = require('../../utils/util.js')
const app = getApp()
// var register = require('../../refreshview/refreshLoadRegister.js');
const network = require('../../utils/network.js')
var interval = null //倒计时函数
Page({
    data: {
        modalName:null,
        apiData:null,
        hasTaken:false,
        expired:false,
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
    onLoad(query) {
        console.log('query',query)
        let id=query.id;
        var that=this
        network.requestGet('/v1/experienceActivity/detail',
            {
                id: id,
            },
            function (data) {
               that.setData({
                   apiData:data,
               })
                // if(data.userExperienceCount>0){
                var hasTaken=true
                if(data.isReceive===true){//还能领
                    hasTaken=false
                }
                that.setData({
                    hasTaken:hasTaken,
                })
            },
            function (msg) {
            }
        )
        // that.setData({//todo test
        //         modalName: 'ModalTakeCouponSuccess',
        // })
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
        // wx.navigateBack({
        //     delta:1,
        // })
    },
    takeCoupon(e){
        var that=this
        network.requestPost('/v1/experienceActivity/receive',
            {
                id: that.data.apiData.id,
            },
            function (data) {
                if(data.flag===false){
                    that.setData({
                        modalName: 'ModalTakeFail',
                    })
                }else {
                    var hasTaken=true
                    if(data.isReceive===true){//还能领
                        hasTaken=false
                    }
                    that.setData({
                        modalName: 'ModalTakeCouponSuccess',
                        experienceCode:data.experienceCode.experienceCode,
                        finishDate:data.experienceCode.finishDate,
                        hasTaken:hasTaken,
                    })
                }

                var pages=getCurrentPages()
                var prePage=pages[pages.length-2]
                if(prePage.refresh){
                    prePage.refresh()
                }
            },
            function (msg) {
            }
        )

    },
    setTimeRemain: function () {
        interval && clearInterval(interval)
        interval=null
        var that = this
        interval = setInterval(function () {
            var pDate=null
            if(!that.data.apiData){
                return;
            }
            if(!that.data.apiData.endDate){
                return;
            }
            pDate= that.data.apiData.endDate
            var endDate = null
            if (typeof pDate == "string") {
                endDate = new Date(Date.parse(pDate.replace(/-/g, "/")));
                console.log('string')
            } else if (typeof pDate == 'number') {
                console.log('number')
                endDate = new Date(pDate);
            }

            var now = new Date();
            var milli = endDate.getTime() - now.getTime()
            if (milli <= 0) {
                that.data.isBtnEnabled = false
                that.setData({
                    hour: '00',
                    minute: '00',
                    second: '00',
                    expired:true,
                })
                return
            }
            var hour = Math.floor(milli / 1000 / 3600)
            var minute = Math.floor(milli % (3600 * 1000) / (60 * 1000))
            var second = Math.floor(milli % (1000 * 60) / 1000)
            that.setData({
                hour: that.formatTime(hour),
                minute: that.formatTime(minute),
                second: that.formatTime(second),
            })
        }, 1000)
    },
    formatTime(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num
    },
    onShow(){
        this.setTimeRemain()
    },
    onHide(){
        interval && clearInterval(interval)
        interval=null
    },
    goStroll(e){

        wx.navigateBack({
            delta:1,
        })
    },
})
