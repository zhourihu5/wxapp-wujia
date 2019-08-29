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
        callPhone:null,
        tabs: [
            {
                title: "小区门禁",
                status:null,
                isOver:false,
                isLoading: false,
                reachBottom:false,
                scrolling:false,
                isUpper:true,
                pageNum: 1,
                data:[
                ],
            },
            {
                title: "单元门禁",
                status:1,
                isOver:false,
                isLoading: false,
                reachBottom:false,
                scrolling:false,
                isUpper:true,
                pageNum: 1,
                data:[
                ],
            },
        ],
        windowHeight:app.globalData.windowHeight,
        pageSize: 20,
        tabLineWidth:util.rpxToPx(28),
        AccessWay:[
            '',
            '通话开锁',
            '监视开锁',
            '刷卡开锁',
            '密码开锁',
            '通知开锁',
            '中心机通话开锁',
            '室内机通话开锁',
            '移动App开锁',
            '手机开锁',
            '固话开锁',
            '网关通话开锁',
            '中心监视开锁',
            '室内机监视开锁',
            'ICID卡刷卡开锁',
            '身份证刷卡开锁',
            '居住证刷卡开锁',
            '市民卡刷卡开锁',
            '二维码刷卡开锁',
            '公共密码开锁',
            '私有密码开锁',
            '胁迫密码开锁',
            '移动APP钥匙开锁',
            '门内开锁',
            '其它开锁',
            '临时密码开锁',
            '蓝牙开锁',
            '刷脸开锁',
            '指纹开锁',
            'APP蓝牙开锁',
            '第三方直接通知设备开锁',
            '第三方识别卡开锁',
            '第三方识别密码开锁',
            '第三方识别人脸开锁',
            '第三方识别指纹开锁',
        ],
        currentVideoUrl:null,

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
    onChange(event) {
        console.log('collapseChange',event)
        var index=event.currentTarget.dataset.index

        this.data.tabs[this.data.active].data[index].collapseValue=event.detail
        this.setData({
            tabs:this.data.tabs
        })
    },
    loadData() {
        var that = this
        var active=that.data.active;
        if (that.data.tabs[active].isOver) {
            return
        }
        that.data.tabs[active].isLoading=true
        that.setData({
            tabs: that.data.tabs,
        })
        //todo 小区门禁和单元门禁有什么区别？？接口怎么区分？？ 现在只有单元门禁，小区门禁还未接入

        var paramData={
            communtityCode:app.communtityCode,
            pageNum: that.data.tabs[active].pageNum,
            pageSize:that.data.pageSize,
        }
        requestTask&&requestTask.abort()
        requestTask=network.requestGet('/v1/apply/accessRecords',paramData,function (data) {
            that.data.tabs[active].isLoading=false
            register&&register.loadFinish(that,true)
            if (that.data.tabs[active].pageNum == 1) {
                that.data.tabs[active].data = []
            }
            that.data.tabs[active].data.push.apply(that.data.tabs[active].data, data.ItemList);
            if(data.Search&&data.Search.RecordCount>that.data.tabs[active].data.length){
                that.data.tabs[active].pageNum++
                that.data.tabs[active].isOver=false
            }else {
                that.data.tabs[active].isOver=true
            }
            that.setData({
                tabs: that.data.tabs,
                imgUrl:data.imgUrl,
            })

            // if(active==0)  {//todo test for video
            //     for(let i=0;i<that.data.tabs[active].data.length;i++){
            //         if(i%2==0){
            //             that.data.tabs[active].data[i].AccessVideo=
            //                 that.data.tabs[active].data[i].AccessVideo
            //                 ||
            //                 "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
            //
            //         }
            //     }
            //     that.setData({
            //         tabs: that.data.tabs,
            //         imgUrl:'',
            //     })
            //     return;
            //
            //     var hasVideo=false
            //     for(var i=0;i<data.ItemList.length;i++){
            //         hasVideo=hasVideo||data.ItemList[i].AccessVideo
            //         if(hasVideo){
            //             break
            //         }
            //     }
            //     if(!hasVideo){
            //         that.loadData();
            //         return
            //     }
            // }

        }, function (msg) {
            register&&register.loadFinish(that,false)
            that.data.tabs[active].isLoading=false
        })


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
    toPlayVideo(e){
       const url= e.currentTarget.dataset.url
        this.data.currentVideoUrl=url
        wx.navigateTo({
            url:"/pages/video/index"
        })
    },

})
