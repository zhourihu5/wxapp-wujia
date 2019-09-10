//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
const app = getApp();
var register = require('../../refreshview/refreshLoadRegister.js');
var requestTask=null
Page({
    data: {
        lowerThreshold: util.lowerThreshold(),
        isOver:false,
        isLoading: false,
        reachBottom: false,
        pageNum: 1,
        pageSize: 20,
        list:[],
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
        this.data.pageNum=1
        this.setData({
            isOver: false,
            reachBottom: false,
        });
        this.loadData();
    },
    onChange(event) {
        console.log('collapseChange',event)
        var index=event.currentTarget.dataset.index

        this.data.list[index].collapseValue=event.detail
        this.setData({
            list:this.data.list
        })
    },
    loadData() {
        var that = this
        if (that.data.isOver) {
            return
        }
        that.data.isLoading=true
        that.setData({
            isLoading: that.data.isLoading,
        })
        var paramData={
            fid:app.fid,
            pageNum: that.data.pageNum,
            pageSize:that.data.pageSize,
        }
        requestTask=network.requestGet('/v1/apply/accessRecords',paramData,function (data) {
            that.data.isLoading=false
            that.setData({
                isLoading:that.data.isLoading,
            })
            register&&register.loadFinish(that,true)
            if (that.data.pageNum == 1) {
                that.data.list = []
            }
            that.data.list.push.apply(that.data.list, data.ItemList);
            if(data.Search&&data.Search.RecordCount>that.data.list.length){
                that.data.pageNum++
                that.data.isOver=false
            }else {
                that.data.isOver=true
            }
            that.setData({
                list:that.data.list,
                isOver: that.data.isOver,
                imgUrl:data.imgUrl,
            })

        }, function (msg) {
            register&&register.loadFinish(that,false)
            that.data.isLoading=false
            that.setData({
                isLoading:that.data.isLoading,
            })
        })


    },

    scrolltolower(e) {
        console.log('scrolltolower')
        this.data.reachBottom=true
        this.setData({
            reachBottom:this.data.reachBottom
        })
        this.loadDataIfNeeded()
    },
    loadDataIfNeeded(){
        if (this.data.isLoading) {
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
