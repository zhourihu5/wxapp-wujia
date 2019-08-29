//index.js
const app = getApp()
Page({
    data: {
        src: null,
        isFullScreen:false,
        CustomBar: app.globalData.CustomBar,
        isShowingModal:false,
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
        var pages=getCurrentPages()
        var prePage=pages[pages.length-2]
        let url=prePage.data.currentVideoUrl
        prePage.data.currentVideoUrl=null
        //test
        // url=url||"http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
        this.setData({
            src:url,
        })

    },
    videoErrorCallback(e){
        console.log('视频错误信息:',e)
        console.log(e.detail.errMsg)
        // app.showToast('视频播放错误，错误信息：'+e.detail.errMsg)
        var that=this
        if(that.data.isShowingModal){
            return
        }
        that.data.isShowingModal=true
        wx.showModal({
            title:'提示:',
            showCancel:false,
            content:msg,
            success (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    that.data.isShowingModal=false
                } else if (res.cancel) {
                    console.log('用户点击取消')
                    that.data.isShowingModal=false
                }
            }
        });
    },
})
