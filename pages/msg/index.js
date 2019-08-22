//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var register = require('../../refreshview/refreshLoadRegister.js');
const app=getApp()
Page({
    data: {
        apiData:null,
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
    setBottomTabBar(){
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            // this.getTabBar().init()
            this.getTabBar().setData({
                active: 2,
            })
        }
    },
    onShow() {
        console.log('msg onShow')
        if(!app.isTabEnabled){
            console.log('getCurrentPages')
            console.log(getCurrentPages())
            wx.switchTab({
                url:'/pages/index/index'
            })
            return
        }
        this.setBottomTabBar()
        this.loadData()
    },
    onHide(){
        console.log('msg onHide')
    },
    loadData(){
        var that=this
        network.requestGet('/v1/message/getTypeList',{},function (data) {
            that.data.apiData=data
            that.setData({
                apiData:data,
            })
            register&&register.loadFinish(that,true)
            for(var i=0;i<data.length;i++){
                if(data[i].unReadNum>0){
                    wx.showTabBarRedDot({
                        index:2,
                    })
                    return
                }
            }
            wx.hideTabBarRedDot({
                index:2,
            })
        },function (msg) {
            register&&register.loadFinish(that,false)
        })
    },
    onLoad: function () {
        console.log('msg onLoad')
        if(!app.isTabEnabled){
            console.log('getCurrentPages')
            console.log(getCurrentPages())
            wx.switchTab({
                url:'/pages/index/index'
            })
            return
        }
        this.setBottomTabBar()
        register.register(this)
    },
    onUnload(){
        console.log('msg onUnload')
    },
    //下拉刷新数据
    refresh:function(){
        this.loadData();
    },
})
