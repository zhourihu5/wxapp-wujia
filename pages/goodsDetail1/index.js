//index.js
import {isNumber} from "../../dist/common/utils";

const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var interval = null //倒计时函数
const app = getApp();
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        apiData: null,
        apiOtherListData:null,
        hour: '00',
        minute: '00',
        second: '00',
        isBtnEnabled: true,
        modalName: null,
        formatTitle: ['产地', '规格', '重量', '包装', '保质期', '贮存方式'],
    },
    setTimeRemain: function (pDate) {
        var that = this
        var endDate = null
        if (typeof pDate == "string") {
            endDate = new Date(Date.parse(pDate.replace(/-/g, "/")));
            console.log('string')
        } else if (typeof pDate == 'number') {
            console.log('number')
            endDate = new Date(pDate);
        }

        // console.log('解析时间为')
        // console.log(endDate)
        // console.log('时间戳')
        // console.log(endDate.getTime())
        // var dateTest=new Date(endDate.getTime())
        // console.log('由时间戳构造的')
        // console.log(dateTest)

        var now = new Date();
        var milli = endDate.getTime() - now.getTime()
        if (milli <= 0) {
            that.data.isBtnEnabled = false
            that.setData({
                hour: '00',
                minute: '00',
                second: '00',
                // isBtnEnabled:false,
            })
            return
        }
        var hour = Math.floor(milli / 1000 / 3600)
        var minute = Math.floor(milli % (3600 * 1000) / (60 * 1000))
        var second = Math.floor(milli % (1000 * 60) / 1000)
        interval = setInterval(function () {
            if (hour == 0 && minute == 0 && second == 0) {
                that.data.isBtnEnabled = false
                that.setData({
                    hour: '00',
                    minute: '00',
                    second: '00',
                })
                clearInterval(interval)
                return
            }
            if (second > 0) {
                second--;
            } else {
                second = 59
                if (minute > 0) {
                    minute--
                } else {
                    minute = 59
                    if (hour > 0) {
                        hour--
                    }
                }
            }
            that.setData({
                hour: that.formatTime(hour),
                minute: that.formatTime(minute),
                second: that.formatTime(second),
            })
        }, 1000)
    }, onLoad: function (query) {
        console.log('商品详情页接收参数')
        console.log(query)
        var that = this
        // that.setTimeRemain("2019-07-31 20:38:23")
        // that.setTimeRemain(1564576703000)
        let id = query.id
        network.requestGet('/v1/activity/findByActivityId', {activityId: id}, function (data) {

            that.setTimeRemain(data.activity.endDate);
            that.setData({
                apiData: data,

            })
        }, function (msg) {

        })
        network.requestGet('/v1/activity/findOtherList',{},function (data) {
            that.setData({
                apiOtherListData:data
            })
        },function (msg) {

        })
    },
    toMore(e) {
        wx.navigateTo({url: "/pages/activityMore/index"})
    },
    goBuy(e) {
        var index=e.currentTarget.dataset.index
        let id =this.data.apiOtherListData[index].id;
        if(this.data.apiOtherListData[index].isJoin==0){
            wx.navigateTo({url: '/pages/goodsDetail/index?id=' + id})
        }else {
            wx.navigateTo({url: '/pages/goodsDetail1/index?id=' + id})
        }
    },
    hideModal(e) {
        this.setData({
            modalName: null,
        })
    },
    showModal(e) {
        this.setData({
            modalName: 'ModalIntro',
        })
    },
    formatTime(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num
    },
    onUnload() {
        interval && clearInterval(interval)
    },

    toConfirmOrder: function (e) {
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }
        if (!this.data.isBtnEnabled) {
            app.showToast('活动已结束，下次再来吧')
            return
        }
        var id = e.currentTarget.dataset.id
        wx.navigateTo({url: "/pages/orderConfirm/index?id=" + id})
    },

    adaptRichText: function (richtext) {//todo 限制富文本图片不超出屏幕宽度
        return richtext.replace('<img ', '<img style="max-width:100%;height:auto"')
    }
})
