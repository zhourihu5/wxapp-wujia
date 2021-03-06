const app = getApp()
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var interval = null //倒计时函数
var register = require('../../refreshview/refreshLoadRegister.js');
let socketOpen = false
Page({
  data: {
    y: util.rpxToPx(40),
    CustomBar: app.globalData.CustomBar,
    customTabBarHeight: util.customTabBarHeight(),
    getCodeText: '获取验证码',
    isBindEnabled: false,
    isAuthorized: app.isAuthorized,
    // modalName: "ModalGuideInvite,ModalBindPhone,ModalGuideMore,ModalGuideOpen,ModalAddCommunity,ModalInviteVisitor",
    modalName: null,
    communtityName: '', //家庭名
    cummunityIndex: null, //家庭index
    apiData: null,
    failReason: null,
    canNotShare: true,
    inviteData: null, //邀请访客时需要的数据
    userId: null,
    autoFocus: 'phone',
  },
  customData: {
    y: util.rpxToPx(40),
    phone: null,
    code: null,
    openid: null,
    wx_user: null
  },
  showNavigationBarLoading() {
    if (this.data.loading) { //下拉刷新
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
  //转发
  onShareAppMessage: function(res) {
    var that = this
    console.log('onShareAppMessage')
    console.log(res)
    if (res.from === 'button') { //邀请好友
      console.log('button onShareAppMessage')
      // that.setData({
      //     shareing:true,
      // })
      that.hideModal()
      // that.setData({
      //     shareing:false,
      // })
      return {
        title: '开锁邀请码', //默认当前小程序名称
        path: `/pages/inviteVisitor/index?applyCode=${that.data.inviteData.code}&communityName=${that.data.inviteData.address}&endDate=${that.data.inviteData.endDate}`,
        imageUrl: '/images/img_share.png',
        success(res) {
          console.log('onShareAppMessage success')
          console.log(res)
          that.hideModal()
        },
        fail(res) {
          console.log('onShareAppMessage fail', res)
        },
        complete(res) { //fixme 转发回调被官方禁掉了
          console.log('onShareAppMessage complete', res)
        }

      }
    }
    return {
      // title: '吾家W+',//默认当前小程序名称
      path: '/pages/index/index',
      success: function(res) {
        console.log('onShareAppMessage success')
        console.log(res)
      }
    }
  },
  inviteVisitor(e) {
    var that = this
    console.log("邀请访客")
    if (!app.userName) {
      that.showModal('ModalBindPhone');
      return;
    }
    this.showModal('ModalInviteVisitor')
    if (that.data.isGeneratingCode) {
      return
    }
    that.data.isGeneratingCode = true
    that.setData({
      canNotShare: true,
    })
    network.requestGet('/v1/apply/secretCodeWithOpenDoor', {
      communtityCode: app.communtityCode,
      fid: app.fid,
    }, function(data) {
      that.data.isGeneratingCode = false
      that.setData({
        inviteData: data,
        canNotShare: false,
      })
    }, function(msg) {
      that.data.isGeneratingCode = false
      that.setData({
        canNotShare: true,
      })
    })
  },
  onClickInviteShare(e) {
    var that = this
    if (this.data.canNotShare) {
      if (that.data.isGeneratingCode) {
        app.showToast('正在生成邀请码，请稍等')
        return
      } else {
        app.showToast('生成邀请码失败，正在重新生成')
        that.inviteVisitor()
        return
      }
    }
    // this.hideModal()
  },
  bindPhone: function(e) {
    var that = this
    if (!this.data.isBindEnabled) {
      return
    }
    var userInfo = that.customData.wx_user || app.wxUserInfo
    network.requestPost('/wx/binding/bindingUser', {
        cover: userInfo && userInfo.userInfo && userInfo.userInfo.avatarUrl,
        nickName: userInfo && userInfo.userInfo && userInfo.userInfo.nickName,
        openid: that.customData.openid,
        userName: that.customData.phone,
        smsCode: that.customData.code
      },
      function(data) {
        app.token = data.token
        let fidChanged = false
        try {
          let i = 0
          let currentFamily = data.familyList[0];
          let fid = wx.getStorageSync('fid')
          if (fid) {
            for (i = 0; i < data.familyList.length; i++) {
              if (data.familyList[i].id == fid) {
                currentFamily = data.familyList[i];
                if (i > 0) {
                  fidChanged = true
                }
                break;
              }
            }
          }

          app.communtityId = currentFamily.communtity.id
          app.communtityCode = currentFamily.communtity.code
          app.fid = currentFamily.id
          that.setData({
            communtityName: currentFamily.name,
            cummunityIndex: i,
          })

        } catch (e) {}
        if (data.unRead) {
          wx.showTabBarRedDot({
            index: 2,
          })
        } else {
          wx.hideTabBarRedDot({
            index: 2,
          })
        }
        app.nickName = data.userInfo.nickName
        app.userName = data.userInfo.userName
        app.wxCover = data.userInfo.wxCover

        that.setData({
          apiData: data,
        })
        if (data.applyLock) {
          if (data.applyLock.status == '0') { //待审核
            wx.redirectTo({
              url: '/pages/auditWait/index'
            })
            return
          } else if (data.applyLock.status == '2') { //不通过
            app.failReason = data.applyLock.remark
            wx.redirectTo({
              url: '/pages/auditFail/index'
            })
            return;
          }
        } else if ('0' == data.isBindingFamily) {
          wx.redirectTo({
            url: '/pages/neibourList/index'
          })
          return;
        }
        that.showGuideInvite();
        that.data.userId = data.userInfo.id
        // that.onAppShow({path:'pages/index/index'})
        if (fidChanged) {
          that.refresh()
        }
      },
      function(msg) {

      }
    )

  },

  goBuy(e) {
    var that = this
    // if(!app.userName){
    //     that.showModal('ModalBindPhone');
    //     return;
    // }
    var index = e.currentTarget.dataset.index
    let id = this.data.apiData.activityList[index].id;
    if (this.data.apiData.activityList[index].isJoin == 1) {
      wx.navigateTo({
        url: '/pages/goodsDetail1/index?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/goodsDetail/index?id=' + id
      })
    }
  },
  moveChangedOpen(e) {
    if (this.data.modalName == 'ModalGuideOpen') {
      return;
    }
    if (e.detail.source) { //表示非setdata改变的
      // event.detail = {x, y, source}
      console.log(e)
      this.customData.y = e.detail.y;

    }
  },
  touchendOpen(e) {

    if (this.data.modalName == 'ModalGuideOpen') {
      return;
    }
    var that = this

    console.log(e)
    console.log(this.customData)
    that.setData({ // 回弹
      y: util.rpxToPx(40),
    })
    if (!app.userName) {
      that.showModal('ModalBindPhone');
      return;
    }

    if (that.customData.y < util.rpxToPx(20)) {
      if (that.data.isOpeningDoor) {
        app.showToast('正在开锁，请稍等')
        return
      }

      //todo 获取地理位置 开锁
      wx.getLocation({
        // type: 'wgs84',
        success(res) {
          console.log('getLocation success,', res)
          that.data.isOpeningDoor = true
          network.requestGet('/v1/apply/openDoor', {
              fid: app.fid,
              longitude: res.longitude,
              latitude: res.latitude
            },
            function(data) {
              that.data.isOpeningDoor = false
              app.showToast('锁已开')
            },
            function(msg) {
              that.data.isOpeningDoor = false
            })
        },
        fail(res) {
          console.log('getLocation fail,', res)
          // app.showToast('请开启获取位置权限')
          that.showModal('ModalLocationSet')
          // wx.showModal({
          //     title:'提示',
          //     content:'请开启获取位置权限',
          //     cancelText:'取消',
          //     showCancel:false,
          //     confirmText:'确定',
          //     success(res) {
          //         console.log('showModal success',res)
          //         that.openSetting()
          //     }
          //
          // })

        }
      })

    } else {

    }
    that.customData.y = util.rpxToPx(40)

    // this.showModal('ModalOpenDoorChoose')

  },
  openSetting(e) {
    this.hideModal(e)
    wx.openSetting({
      success(res) {
        console.log('openSetting success,', res)
      },
      fail(res) {
        console.log('openSetting fail,', res)
      }
    })
  },
  isEnableTabBar() {
    this.enableTabBar(!this.data.modalName);
  },
  enableTabBar(enabled) {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().enable(enabled)
    } else {
      app.isTabEnabled = enabled
    }
  },
  showModal(name) {
    this.setData({
      modalName: name,
    })
    this.isEnableTabBar()
  },
  showModalAddCommunity(e) {
    var that = this
    if (!app.userName) {
      that.showModal('ModalBindPhone');
      return;
    }
    this.showModal('ModalAddCommunity')
  },
  toCoupon(e) {
    var that = this
    // if(!app.userName){
    //     that.showModal('ModalBindPhone');
    //     return;
    // }
    wx.navigateTo({
      url: '/pages/coupon/index'
    })
  },
  switchCommunity(e) {
    var that = this
    if (!app.userName) {
      that.showModal('ModalBindPhone');
      return;
    }
    var index = e.currentTarget.dataset.index
    if (this.data.cummunityIndex == index) {
      this.hideModal()
      return
    }
    this.setData({
      cummunityIndex: index,
      communtityName: this.data.apiData.familyList[index].name
    })
    app.communtityId = this.data.apiData.familyList[index].communtity.id
    app.communtityCode = this.data.apiData.familyList[index].communtity.code
    app.fid = this.data.apiData.familyList[index].id

    this.hideModal()

    network.requestGet('/v1/activity/wxIndex', {
      communityId: app.communtityId
    }, function(data) {
      that.setData({
        apiData: data,
      })
      // 设置菜单红点
      if (data.unRead) {
        wx.showTabBarRedDot({
          index: 2,
        })
      } else {
        wx.hideTabBarRedDot({
          index: 2,
        })
      }
    }, function(msg) {

    })
    wx.setStorage({
      key: 'fid',
      data: app.fid,
    })
  },
  addCommunity(e) {
    this.hideModal()
    wx.navigateTo({
      url: '/pages/neibourList/index'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
    })
    this.isEnableTabBar()
  },
  bindGetUserInfo: function(e) {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function(res_user) {
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
  showOrHideBindPhone: function() {
    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          console.log('微信登录成功')
          console.log(res)
          //发起网络请求
          var paramData = {
            code: res.code,
          }

          network.requestGet('/wx/binding/checkBinding', paramData, function(data) {
            that.setData({
              apiData: data,
            })
            app.token = data.token
            let fidChanged = false
            try {
              let i = 0
              let currentFamily = data.familyList[0];
              let fid = wx.getStorageSync('fid')
              if (fid) {
                for (i = 0; i < data.familyList.length; i++) {
                  if (data.familyList[i].id == fid) {
                    currentFamily = data.familyList[i];
                    if (i > 0) {
                      fidChanged = true
                    }
                    break;
                  }
                }
              }

              app.communtityId = currentFamily.communtity.id
              app.communtityCode = currentFamily.communtity.code
              app.fid = currentFamily.id
              that.setData({
                communtityName: currentFamily.name,
                cummunityIndex: i,
              })
            } catch (e) {}
            if (data.unRead) {
              wx.showTabBarRedDot({
                index: 2,
              })
            } else {
              wx.hideTabBarRedDot({
                index: 2,
              })
            }
            that.customData.openid = data.openid
            if (data.userInfo) {
              app.nickName = data.userInfo.nickName
              app.userName = data.userInfo.userName
              app.wxCover = data.userInfo.wxCover
              if (data.applyLock) {
                if (data.applyLock.status == '0') { //待审核
                  wx.redirectTo({
                    url: '/pages/auditWait/index'
                  })
                } else if (data.applyLock.status == '2') { //不通过
                  app.failReason = data.applyLock.remark
                  wx.redirectTo({
                    url: '/pages/auditFail/index'
                  })
                }
              } else if ('0' == data.isBindingFamily) {
                wx.redirectTo({
                  url: '/pages/neibourList/index'
                })
              }

              that.hideModal();
              that.data.userId = data.userInfo.id
              // that.onAppShow({path:'pages/index/index'})
            } else {
              wx.onKeyboardHeightChange(res => {
                console.log('onKeyboardHeightChange', res)
                // var padding=res.height-util.rpxToPx(60)
                var padding = res.height
                if (padding < 0) {
                  padding = 0
                }
                that.setData({
                  modalPadding: padding,
                })
              })
              that.showModal('ModalBindPhone');


            }
            if (fidChanged) {
              that.refresh()
            }
          }, function(msg) {

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  initWebsocket(userId) {
    var that = this
    var socketMsgQueue = []

    wx.onSocketOpen(function(res) {
      console.log('onSocketOpen ', res)
      socketOpen = true
      for (let i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    })
    wx.onSocketMessage(function(res) {
      console.log('onSocketMessage ', res)
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1]
      if (currentPage.route == 'pages/msgDetail/index') {
        currentPage.refresh()
      } else if (currentPage.route == 'pages/msg/index') {
        currentPage.refresh()
      } else {
        getIsUnReadMessage()
      }
      // sendSocketMessage('小程序已收到消息了，感谢')
    })
    wx.onSocketClose(function() {
      socketOpen = false
      console.log('onSocketClose ')
    })
    wx.onSocketError(function(error) {
      socketOpen = false
      console.log('onSocketError ', error)
    })
    var url = app.url
    url = url.substr(url.indexOf("//"))
    url = 'ws:' + url;
    console.log('websocket url', url)
    wx.connectSocket({
      url: url + '/websocket/' + userId
    })

    wx.onAppShow(this.onAppShow)

    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg,
          success(res) {
            console.log('sendSocketMessage success ', res)
          },
          fail(res) {
            console.log('sendSocketMessage fail ', res)
          }
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }

    function getIsUnReadMessage() {
      network.requestGet('/v1/message/isUnRead', {}, function(data) {
        if (data) {
          wx.showTabBarRedDot({
            index: 2,
          })
        } else {
          wx.hideTabBarRedDot({
            index: 2,
          })
        }
      }, function(msg) {

      })
    }
  },
  onAppShow(res) {
    console.log('onAppShow ', res)
    if (this.data.userId) {
      var that = this
      if (!socketOpen) {
        that.initWebsocket(that.data.userId)
        console.log('重新连接socket')
      }

      interval && clearInterval(interval)
      interval = setInterval(function() {
        console.log('轮询检测心跳')
        if (!socketOpen) {
          that.initWebsocket(that.data.userId)
          console.log('重新连接socket')
        }
      }, 1000 * 60)
    }
  },
  onUnload() {
    wx.closeSocket({
      reason: '小程序已退出',
      success(res) {
        console.log('closeSocket  success', res)
      },
      fail(res) {
        console.log('closeSocket  fail', res)
      }
    })
    interval && clearInterval(interval)
  },
  setBottomTabBar() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      app.isCustomTabBar = true
      this.setData({
        customTabBarHeight: util.customTabBarHeight(),
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
    if (app.activityChanged) {
      app.activityChanged = false
      // this.showOrHideBindPhone();
      this.refresh()
    }
  },
  onHide() {
    console.log('index onHide')
  },
  onLoad: function(options) {
    console.log('index onLoad')
    register.register(this);
    this.setBottomTabBar()
    console.log(options)
    wx.showShareMenu({
      withShareTicket: true,
      success: function() {
        console.log('showShareMenu success')
      }
    })
    this.showOrHideBindPhone();
    // this.showGuideInvite()
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
    wx.stopPullDownRefresh()
    this.refresh()
  },
  refresh() { //下拉刷新
    var that = this
    // if(true){
    //     register && register.loadFinish(that, true)
    //     return
    // }

    network.requestGet('/v1/activity/wxIndex', {
      communityId: app.communtityId
    }, function(data) {
      that.setData({
        apiData: data,
      })
      if (data.unRead) {
        wx.showTabBarRedDot({
          index: 2,
        })
      } else {
        wx.hideTabBarRedDot({
          index: 2,
        })
      }
      register && register.loadFinish(that, true)
    }, function(msg) {
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
    that.setData({
      autoFocus: 'code',
    })
    wx.onKeyboardHeightChange(res => {
      console.log('getVcode onKeyboardHeightChange', res)
      // var padding=res.height-util.rpxToPx(60)
      var padding = res.height
      if (padding < 0) {
        padding = 0
      }
      that.setData({
        modalPadding: padding,
      })
    })
    setTimeout(function() {

      wx.onKeyboardHeightChange(res => {
        console.log('setTimeout onKeyboardHeightChange', res)
        // var padding=res.height-util.rpxToPx(60)
        var padding = res.height
        if (padding < 0) {
          padding = 0
        }
        that.setData({
          modalPadding: padding,
        })
        if (res.height < 10) {
          that.setData({
            autoFocus: null,
          })
        }
      })
    }, 2000)



    var currentTime = 61
    interval && clearInterval(interval)
    interval = setInterval(function() {
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
    }, function(data) {

    }, function(msg) {

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
    wx.navigateTo({
      url: "/pages/activityMore/index"
    })
    // util.navibackTo("/pages/activityMore/index")
  },

})