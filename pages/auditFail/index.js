//index.js
const util = require('../../utils/util.js')
const app = getApp()
var register = require('../../refreshview/refreshLoadRegister.js');
Page({
    data: {
        failReason: null,
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
    onShow() {
    },
    //下拉刷新数据
    refresh:function(){
        var that=this

        wx.login({
            success(res) {
                register&&register.loadFinish(that,true)
                if (res.code) {
                    console.log('微信登录成功')
                    console.log(res)
                    //发起网络请求
                    network.requestGet('/wx/binding/checkBinding', {
                        code: res.code
                    }, function (data) {
                        // that.setData({
                        //     communtityName: data.communtityName,
                        //     apiData: data,
                        // })
                        app.token = data.token
                        try {
                            app.communtityId = data.communtityList[0].id
                            app.communtityCode = data.communtityList[0].code
                        } catch (e) {
                        }
                        // that.customData.openid = data.openid
                        if (data.userInfo) {
                            app.nickName = data.userInfo.nickName
                            app.userName=data.userInfo.userName
                            app.wxCover=data.userInfo.wxCover
                            app.fid=data.userInfo.fid
                            if (data.applyLock) {
                                if (data.applyLock.status == '0') {//待审核
                                    wx.redirectTo({url: '/pages/auditWait/index'})
                                } else if (data.applyLock.status == '2') {//不通过
                                    app.failReason = data.applyLock.remark
                                    wx.redirectTo({url: '/pages/auditFail/index'})
                                }
                            }else if ('0' == data.isBindingFamily) {
                                wx.redirectTo({url: '/pages/neibourList/index'})
                            }

                            // that.enableTabBar(true)
                            // that.hideModal();
                        } else {
                            // that.enableTabBar(false)
                            // that.showModal('ModalBindPhone');
                            wx.reLaunch({
                                url:'/pages/index/index',
                            })
                        }
                    }, function (msg) {
                        register&&register.loadFinish(that,false)
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })



    },
    onLoad: function (options) {
        register.register(this);
        // var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
        // // var currentPage  = pages[pages.length - 1]  //当前界面
        // var prePage = pages[pages.length - 2]  //上一个界面
        this.setData({
            // failReason: prePage.data.failReason,
            failReason: app.failReason,
        })
        // prePage.data.failReason = null
    },
    onClick(e) {
        wx.redirectTo({url: '/pages/neibourList/index'})
    }
})
