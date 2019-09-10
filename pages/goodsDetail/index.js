const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var interval = null //倒计时函数
const app = getApp();
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        apiData: null,
        hour: '00',
        minute: '00',
        second: '00',
        isBtnEnabled: true,
        modalName: null,
        saleTip:null,
        formatTitle: ['产地', '规格', '重量', '包装', '保质期', '贮存方式'],
        couponTaken:false,
        couponIsValid:false,
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
    setTimeRemain: function () {
        interval && clearInterval(interval)
        interval=null
        var that = this
        interval = setInterval(function () {
            var pDate=null
            if(!that.data.apiData){
                return;
            }
            if(!that.data.apiData.activity){
                return;
            }
            if(!that.data.apiData.activity.endDate){
                return;
            }

            pDate= that.data.apiData.activity.endDate
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
                    // isBtnEnabled:false,
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
    onLoad: function (query) {
        console.log('商品详情页接收参数')
        console.log(query)
        // if(true){//todo test
        //     return;
        // }

        // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
        // const scene = decodeURIComponent(query.scene)

        var that = this
        // that.setTimeRemain("2019-07-31 20:38:23")
        // that.setTimeRemain(1564576703000)
        let id = query.id
        network.requestGet('/v1/activity/findByActivityId', {activityId: id}, function (data) {
            // data.activity.remark=
            //     // "<div style='max-height: 300rpx;overflow: scroll'>" +
            //     "<div>" +
            //     "     <p>" +
            //     "        <strong>标题1</strong>" +
            //     "        ：第1行内容 很长爱上的看法阿斯蒂芬阿斯顿发送到奥德赛a奥德赛阿斯蒂芬阿斯顿发送到发送到是发送到发送到发" +
            //     "         送到发送到阿斯蒂芬撒旦法撒旦法是大法师的阿斯蒂芬sad阿斯顿发斯蒂芬第三方咖啡馆的开发大家观看法国进口非关键是看到；付过款东方国际" +
            //     "      </p>" //+
            //     "      <p><strong>标题2</strong>" +
            //     "        ：第2行内容 很长爱上的看法"+
            //     "      </p>" +
            //     // "     <div>\n" +
            //     // "          <span class='d-c-t'> 2. 限时支付：</span>\n" +
            //     // "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     // "     </div>\n" +
            //     // "     <div>\n" +
            //     // "          <span class='d-c-t'> 3. 限时支付：</span>\n" +
            //     // "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     // "     </div>\n" +
            //     // "     <div>\n" +
            //     // "          <span class='d-c-t'> 4. 限时支付：</span>\n" +
            //     // "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     // "     </div>\n" +
            //     // "     <div>\n" +
            //     // "          <span class='d-c-t'> 5. 限时支付：</span>\n" +
            //     // "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     // "     </div>\n" +
            //     // "     <div>\n" +
            //     // "          <span class='d-c-t'> 6. 限时支付：</span>\n" +
            //     // "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     // "     </div>\n" +
            //     // "     <div>\n" +
            //     // "          <span class='d-c-t'> 7. 限时支付：</span>\n" +
            //     // "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     // "     </div>\n" +
            //     // "     <div>\n" +
            //     // "          <span class='d-c-t'> 8. 限时支付：</span>\n" +
            //     // "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     // "     </div>\n" +
            //     "     <div>\n" +
            //     "          <span class='d-c-t'> 9. 限时支付：</span>\n" +
            //     "          <span class='d-c-c p-b-30'>团购商品成功下单后需要在10分钟之内完成支付，否则该订单会自动取消。</span>\n" +
            //     "     </div>\n" +
            // " </div>"

            // data.activity.remark='这是第一行内容\n这是第二行内容'//换行符不起作用
                console.log('remark')
            console.log(data.activity.remark)

            // data.activity.commodity.infos="" +
            //     "<p>这是一个段咯</p>" +
            //     "<div>" +
            //     "<img " +"alt='图片的 alt'"+
            //     "src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565250388091&di=79dda0ba1c5826644bcad971f68941ed&imgtype=0&src=http%3A%2F%2Fimg.3727.cc%2FImages%2FPicture%2Ffengjinggaoqingzhuomianbizhi%2Fpubumeijingzhuomianbizhi%2F3-141213103043.jpg'/>" +
            //     "</div>" +
            //     "<p>这是尾端内容</p>"
            console.log('infos')
            data.activity.commodity.infos=that.adaptRichText(data.activity.commodity.infos)
            console.log(data.activity.commodity.infos)
            that.setData({
                apiData: data,
                saleTip:data.activity.saleTip&&data.activity.saleTip.split(','),
            })
            if(data.coupon&&data.coupon.userCouponCount>0){
                that.setData({
                    couponTaken:true,
                    couponIsValid:data.coupon.isValid,
                })
            }else {
                that.setData({
                    couponTaken:false,
                })
            }
        }, function (msg) {

        })
    },
    onShow(){
        this.setTimeRemain()
    },
    onHide(){
        interval && clearInterval(interval)
        interval=null
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
    toConfirmOrder: function (e) {
        if(!app.userName){
            wx.reLaunch({
                url:"/pages/index/index"
            })
            return;
        }
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }
        if (!this.data.isBtnEnabled) {
            app.showToast('本活动已结束，下次再来吧')
            return
        }
        var startDate = new Date(Date.parse(this.data.apiData.activity.startDate.replace(/-/g, "/")));
        var dateNow=new Date()
        if(dateNow.getTime()-startDate.getTime()<0){
            app.showToast('活动还未开始，请等待活动开始')
            return
        }

        var id =this.data.apiData.activity.id
        wx.navigateTo({url: "/pages/orderConfirm/index?id=" + id})
    },

    adaptRichText: function (richtext) {// 限制富文本图片不超出屏幕宽度
        if(!richtext){
            return richtext
        }
        return richtext.replace('<img ', '<img style="max-width:100%;height:auto" ')
    },
    couponClicked(e){
        var that=this
        if(!this.data.couponIsValid){
            return;
        }
        if(this.data.couponTaken){
            this.toConfirmOrder(e)
            return
        }
        network.requestPost('/v1/coupon/receive',
            {
                id: that.data.apiData.coupon.id,
            },
            function (data) {
                if(data.flag===false){
                    this.setData({
                        modalName: 'ModalTakeFail',
                    })
                }else {
                    that.setData({
                        couponTaken:true,
                    })
                    app.showToast('领取成功')
                }

            },
            function (msg) {
            }
        )


    },
})
