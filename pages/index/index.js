const app = getApp()
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var interval = null //倒计时函数
var register = require('../../refreshview/refreshLoadRegister.js');
Page({
    data: {
        y: util.rpxToPx(40),
        CustomBar: app.globalData.CustomBar,
        customTabBarHeight:util.customTabBarHeight(),
        getCodeText: '获取验证码',
        isBindEnabled: false,
        isAuthorized: app.isAuthorized,
        // modalName: "ModalGuideInvite,ModalBindPhone,ModalGuideMore,ModalGuideOpen,ModalAddCommunity,ModalInviteVisitor",
        modalName: null,
        communtityName: '',
        cummunityIndex: null,
        apiData: null,
        failReason: null,
        applyCode:null,//todo 动态开锁密码
        canNotShare:true,
        inviteData:null,//邀请访客时需要的数据
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
    //转发
    onShareAppMessage: function(res) {
        var that=this
        console.log('onShareAppMessage')
        console.log(res)
        if (res.from === 'button') {//邀请好友
            console.log('button onShareAppMessage')
            return {
                title: '开锁邀请码',//默认当前小程序名称
                path: `/pages/inviteVisitor/index?applyCode=${that.data.inviteData.code}&communityName=${that.data.inviteData.address}&endDate=${that.data.inviteData.endDate}`,
                success: function (res) {
                    console.log('onShareAppMessage success')
                    console.log(res)
                }
            }
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
    inviteVisitor(e) {
        var that=this
        console.log("邀请访客")
        // wx.navigateTo({
        //     url:"/pages/inviteVisitor/index"
        // })
        this.showModal('ModalInviteVisitor')
        if(that.data.isGeneratingCode){
            return
        }
        that.data.isGeneratingCode=true
        that.setData({
            canNotShare:true,
        })
        network.requestGet('/v1/apply/secretCodeWithOpenDoor',{communtityCode:app.communtityCode},function (data) {
            that.data.isGeneratingCode=false
            that.setData({
                inviteData:data,
                canNotShare:false,
            })
        },function (msg) {
            that.data.isGeneratingCode=false
            that.setData({
                canNotShare:true,
            })
        })
    },
    onClickInviteShare(e){
        var that=this
        if(this.data.canNotShare){
            if(that.data.isGeneratingCode){
                app.showToast('正在生成邀请码，请稍等')
                return
            }else {
                app.showToast('生成邀请码失败，正在重新生成')
                that.inviteVisitor()
                return
            }
        }
        this.hideModal()
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
                if (data.applyLock) {
                    if (data.applyLock.status == '0') {//待审核
                        wx.redirectTo({url: '/pages/auditWait/index'})
                        return
                    } else if (data.applyLock.status == '2') {//不通过
                        app.failReason = data.applyLock.remark
                        wx.redirectTo({url: '/pages/auditFail/index'})
                        return;
                    }
                }else if ('0' == data.isBindingFamily) {
                    wx.redirectTo({url: '/pages/neibourList/index'})
                    return;
                }
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
        if(this.data.modalName=='ModalGuideOpen'){
            return;
        }
        console.log(e)
        // event.detail = {x, y, source}
        if (e.detail.source) {//表示非setdata改变的
            this.customData.y = e.detail.y;

        }
    },
    touchendOpen(e) {
        if(this.data.modalName=='ModalGuideOpen'){
            return;
        }

        console.log(e)
        console.log(this.customData)
        var that=this
        that.setData({// 回弹
            y: util.rpxToPx(40),
        })
        if (this.customData.y < util.rpxToPx(20)) {
            if(that.data.isOpeningDoor){
                app.showToast('正在开锁，请稍等')
                return
            }
            that.data.isOpeningDoor=true
            network.requestGet('/v1/apply/openDoor',{communtityCode:app.communtityCode},function (data) {
                that.data.isOpeningDoor=false
                app.showToast('锁已开')
            },function (msg) {
                that.data.isOpeningDoor=false
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
        }else {
           app.isTabEnabled=enabled
        }
    },
    showModal(name) {
        // app.isCustomTabBar=true
        // var that=this
        // wx.hideTabBar({
        //     aniamtion:false,
        //     success(res) {
        //         console.log('hideTabBar success')
        //         that.setData({
        //             modalName: name,
        //             customTabBarHeight:util.customTabBarHeight(),
        //         })
        //     }
        // })
        this.setData({
            modalName: name,
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
        app.communtityId=this.data.apiData.communtityList[index].id
        app.communtityCode=this.data.apiData.communtityList[index].code

        this.hideModal()
        var that=this
        network.requestGet('/v1/activity/wxIndex',{communityId:app.communtityId} , function (data) {
            that.setData({
                apiData: data,
            })
        }, function (msg) {

        })
    },
    addCommunity(e) {
        this.hideModal()
        wx.navigateTo({
            url:'/pages/neibourList/index'
        })
    },
    hideModal(e) {
        // app.isCustomTabBar=false
        this.setData({
            modalName: null,
            // customTabBarHeight:util.customTabBarHeight(),
        })
        // var that=this
        // wx.showTabBar({
        //     aniamtion:false,
        //     success(res) {
        //         console.log('showTabBar success')
        //         that.setData({
        //             modalName: name,
        //             // customTabBarHeight:util.customTabBarHeight(),
        //         })
        //     }
        // })
        this.isEnableTabBar()
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
                    var paramData={
                        code: res.code,
                    }

                    network.requestGet('/wx/binding/checkBinding',paramData , function (data) {
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

                            that.hideModal();
                        } else {
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
    setBottomTabBar(){
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            app.isCustomTabBar=true
            this.setData({
                customTabBarHeight:util.customTabBarHeight(),
            })
            // this.getTabBar().init()
            this.getTabBar().setData({
                active: 0,
            })
        }
    },
    onShow() {
        console.log('index onShow')
        this.setBottomTabBar()
        if(app.activityChanged){
            app.activityChanged=false
            this.showOrHideBindPhone();
        }
    },
    onHide(){
        console.log('index onHide')
    },
    onLoad: function (options) {
        console.log('index onLoad')
        register.register(this);
        this.setBottomTabBar()
        console.log(options)
        var applyCode=options&&options.applyCode
        if(applyCode){//todo 动态开锁密码
            this.data.applyCode=applyCode
        }
        wx.showShareMenu({
            withShareTicket: true,
            success:function () {
                console.log('showShareMenu success')
            }
        })
        this.showOrHideBindPhone();
        // this.showGuideInvite()
    },
    onUnload(){
        console.log('index onUnload')
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
    onPullDownRefresh: function() {
        this.refresh()
    },
    refresh(){//下拉刷新
        wx.stopPullDownRefresh()
        var that=this
        network.requestGet('/v1/activity/wxIndex',{communityId:app.communtityId} , function (data) {
            that.setData({
                apiData: data,
            })
            register && register.loadFinish(that, true)
        }, function (msg) {
            register && register.loadFinish(that, false)
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
        // util.navibackTo("/pages/activityMore/index")
    },

})
