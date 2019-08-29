//index.js
const util = require('../../utils/util.js')
const app = getApp()
const network = require('../../utils/network.js')
Page({
    data: {
        apiData:null,
        shadowTop:null,
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
    onShow() {
    },
    navigateBack(){
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },
    onLoad: function (options) {
        console.log('inviteVisitor page options')
        console.log(options)
        // if(true){
        //   options = options || {}//todo test
        //   options.applyCode = '1234'
        //   options.communityName = '天通苑小区'
        //   options.endDate = '2019.8.11 20:00'
        // }
        

        if(options){
            this.data.apiData={}
            this.data.apiData.applyCode=options.applyCode
            this.data.apiData.communityName=options.communityName
            // this.data.apiData.applyCodeSplit=options.applyCode&&options.applyCode.split('')
            this.data.apiData.applyCodeSplit=options.applyCode
            this.data.apiData.endDate=options.endDate
        }
        this.setData({
            apiData:this.data.apiData
        })
        console.log('inviteVisitor page apiData')
        console.log(this.data.apiData)

        var that=this
        wx.createSelectorQuery()
            .in(this)[ 'select']('.container-t')
            .boundingClientRect(rect => {
                console.log('.container-t boundingClientRect',rect)

                that.setData({
                    shadowTop:rect.bottom-util.rpxToPx(40)
                })
            })
            .exec();
    },
    //转发
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
    copyCode(e) {
        var that=this
        wx.setClipboardData({
            // data:that.data.apiData.applyCode,
            data:'*'+that.data.apiData.applyCode+'*',
            success (res) {
                wx.getClipboardData({
                    success (res) {
                        console.log('复制成功')
                        console.log(res.data) // data
                    }
                })
            }
        })
    }
})
