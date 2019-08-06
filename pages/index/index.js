const app = getApp()
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var interval = null //倒计时函数
Page({
    data: {
        y: util.rpxToPx(40),
        CustomBar: app.globalData.CustomBar,
        getCodeText: '获取验证码',
        isBindEnabled: false,
        isAuthorized: app.isAuthorized,
        modalName: "ModalGuideInvite,ModalBindPhone,ModalGuideMore,ModalGuideOpen,ModalAddCommunity,",
        communtityName: '',
        cummunityIndex: null,
        apiData: null,
        failReason: null,
    },
    customData: {
        y: 0,
        phone: null,
        code: null,
        openid: null,
        wx_user: null
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
    bindPhone: function (e) {
        var that = this
        if (!this.data.isBindEnabled) {
            return
        }
        var userInfo = that.customData.wx_user || app.wxUserInfo
        network.requestPost('/wx/binding/bindingUser',
            {
                cover: userInfo && userInfo.userInfo && userInfo.userInfo.avatarUrl,
                nickName: userInfo && userInfo.userInfo && userInfo.userInfo.nickName,
                openid: that.customData.openid,
                userName: that.customData.phone,
                smsCode: that.customData.code
            },
            function (data) {
                app.token = data.token
                try {
                    app.communtityId = data.communtityList[0].id
                    app.communtityCode = data.communtityList[0].code
                } catch (e) {
                }
                app.nickName = data.userInfo.nickName
                app.userName=data.userInfo.userName
                app.wxCover=data.userInfo.wxCover
                app.fid=data.userInfo.fid
                that.setData({
                    communtityName: data.communtityName,
                    apiData: data,
                })
                if ('0' == data.isBindingFamily) {
                    wx.redirectTo({url: '/pages/neibourList/index'})
                } else if (data.applyLock) {
                    if (data.applyLock.status == '0') {//待审核
                        wx.redirectTo({url: '/pages/auditWait/index'})
                    } else if (data.applyLock.status == '2') {//不通过
                        that.data.failReason = data.applyLock.remark
                        wx.redirectTo({url: '/pages/auditFail/index'})
                    }
                }
                that.hideModal();
                that.showGuideInvite();
            },
            function (msg) {

            }
        )

    },
    goBuy(e) {
        var index=e.currentTarget.dataset.index
        let id =this.data.apiData.activityList[index].id;
        if(this.data.apiData.activityList[index].isJoin==1){
            wx.navigateTo({url: '/pages/goodsDetail1/index?id=' + id})
        }else {
            wx.navigateTo({url: '/pages/goodsDetail/index?id=' + id})
        }
    },
    moveChangedOpen(e) {
        console.log(e)
        // event.detail = {x, y, source}
        if (e.detail.source) {//表示非setdata改变的
            this.customData.y = e.detail.y;

        }
    },
    touchendOpen(e) {
        console.log(e)
        console.log(this.customData)
        if (this.customData.y < util.rpxToPx(20)) {
            //todo 请求开锁接口，成功后回弹
            this.setData({// 回弹
                y: util.rpxToPx(40),
            })
        } else {

        }
    },
    isEnableTabBar() {
        this.enableTabBar(!this.data.modalName);
    },
    enableTabBar(enabled) {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().enable(enabled)
        }
    },
    showModal(name) {
        this.setData({
            modalName: name
        })
        this.isEnableTabBar()
    },
    showModalAddCommunity(e) {
        // //todo test
        // this.data.apiData.communtityList =this.data.apiData.communtityList||[]
        // var i=0;
        // for(i=0;i<20;i++){
        //     this.data.apiData.communtityList.push({
        //         name:'test '+i,
        //     })
        // }
        // this.setData({
        //     apiData:this.data.apiData,
        // })
        // console.log('communtityList 数据')
        // console.log(this.data.apiData.communtityList)
        // //todo test

        this.showModal('ModalAddCommunity')
    },
    switchCommunity(e) {
        var index = e.currentTarget.dataset.index
        if (this.data.cummunityIndex == index) {
            this.hideModal()
            return
        }
        this.setData({
            cummunityIndex: index,
            communtityName: this.data.apiData.communtityList[index].name
        })

        this.hideModal()
    },
    addCommunity(e) {
        this.hideModal()
        wx.navigateTo({
            url:'/pages/neibourList/index'
        })
    },
    hideModal() {
        this.setData({
            modalName: null
        })
        this.isEnableTabBar()
    },
    onLoad: function () {
        this.showOrHideBindPhone();
    },
    bindGetUserInfo: function (e) {
        var that = this;
        wx.getUserInfo({
            withCredentials: true,
            success: function (res_user) {
                app.wxUserInfo = res_user
                that.setData({
                    isAuthorized: true
                })
                app.isAuthorized = true
                that.customData.wx_user = res_user
                that.bindPhone(e)
            }
        })
    },
    showOrHideBindPhone: function () {
        const that = this
        wx.login({
            success(res) {
                if (res.code) {
                    console.log('微信登录成功')
                    console.log(res)
                    //发起网络请求
                    network.requestGet('/wx/binding/checkBinding', {
                        code: res.code
                    }, function (data) {
                        that.setData({
                            communtityName: data.communtityName,
                            apiData: data,
                        })
                        app.token = data.token
                        try {
                            app.communtityId = data.communtityList[0].id
                            app.communtityCode = data.communtityList[0].code
                        } catch (e) {
                        }
                        that.customData.openid = data.openid
                        if (data.userInfo) {
                            app.nickName = data.userInfo.nickName
                            app.userName=data.userInfo.userName
                            app.wxCover=data.userInfo.wxCover
                            app.fid=data.userInfo.fid
                            if ('0' == data.isBindingFamily) {
                                wx.redirectTo({url: '/pages/neibourList/index'})
                            } else if (data.applyLock) {
                                if (data.applyLock.status == '0') {//待审核
                                    wx.redirectTo({url: '/pages/auditWait/index'})
                                } else if (data.applyLock.status == '2') {//不通过
                                    that.data.failReason = data.applyLock.remark
                                    wx.redirectTo({url: '/pages/auditFail/index'})
                                }
                            }
                            that.enableTabBar(true)
                            that.hideModal();
                        } else {
                            that.enableTabBar(false)
                            that.showModal('ModalBindPhone');
                        }
                    }, function (msg) {

                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    onShow() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().init()
            console.log("自定义tabbar")
        }
        if(app.activityChanged){
            app.activityChanged=false
            this.showOrHideBindPhone();
        }
    },
    phoneInput(e) {
        this.customData.phone = e.detail.value
        this.verifyCodeAndPhone()
    },
    codeInput(e) {
        this.customData.code = e.detail.value
        this.verifyCodeAndPhone()
    },
    verifyCodeAndPhone() {
        if (this.customData.code && this.customData.phone) {
            this.setData({
                isBindEnabled: util.isTel(this.customData.phone),
            })

            return
        }
        this.setData({
            isBindEnabled: false,
        })
    },


    getVcode(e) {
        const that = this;
        if (that.data.getCodeText != '获取验证码') {
            return
        }
        if (!util.isTel(this.customData.phone)) {
            app.showToast("请输入正确的手机号")
            return;
        }

        var currentTime = 61
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                getCodeText: currentTime + 's'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    getCodeText: '获取验证码',
                })
            }
        }, 1000)
        network.requestGet('/wx/binding/sendMsg', {
            userName: that.customData.phone
        }, function (data) {
            if (!data.userInfo) {
                that.enableTabBar(false)
                that.showModal('ModalBindPhone');
            } else {
                that.enableTabBar(true)
                that.hideModal();
            }
        }, function (msg) {

        })
    },
    showGuideInvite() {
        this.hideModal();
        this.showModal('ModalGuideInvite');
    },
    hideModalGuideInvite(e) {
        this.hideModal();
        this.showModal('ModalGuideMore');
    },
    hideModalGuideMore(e) {
        this.hideModal();
        this.showModal('ModalGuideOpen');
    },
    hideModalGuideOpen(e) {
        this.hideModal();
    },
    toMore(e) {
        wx.navigateTo({url: "/pages/activityMore/index"})
    },
    inviteVisitor(e) {
        console.log("邀请访客")

    },
})
