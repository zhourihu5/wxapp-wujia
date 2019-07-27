//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    y:40/app.globalData.pixelRatio,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    modalName:"ModalGuideInvite,ModalBindPhone,ModalGuideMore,ModalGuideOpen,",
    isBoundPhone:false,
    list: [
      {
        isOrdered:'',
      },
      {
        isOrdered:1,
      },
      {
        isOrdered:'',
      },
      {
        isOrdered:1,
      },

    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindPhone: function(e) {
    console.log("bindphone");


    this.hideModal();
    this.showGuideInvite();

  },
  isEnableTabBar(){
    this.enableTabBar(!this.data.modalName);
  },
  enableTabBar(enabled){
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
  hideModal() {
    this.setData({
      modalName: null
    })
    this.isEnableTabBar()
  },
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  showOrHideBindPhone: function () {
    if (!this.data.isBoundPhone) {
      this.enableTabBar(false)
      this.showModal('ModalBindPhone');
    } else {
      this.enableTabBar(true)
      this.hideModal();
    }
  },
  onShow(){

    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
      this.getTabBar().init()
      console.log("自定义tabbar")
    }
    // this.showOrHideBindPhone();
    // this.showModal('ModalGuideOpen');
    // this.showModal('ModalGuideMore');
    // this.isEnableTabBar()

  },
  showGuideInvite(){
    this.hideModal();
    this.showModal('ModalGuideInvite');
  },
  hideModalGuideInvite(e){
    this.hideModal();
    this.showModal('ModalGuideMore');
  },
  hideModalGuideMore(e){
    this.hideModal();
    this.showModal('ModalGuideOpen');
  },
  hideModalGuideOpen(e){
    this.hideModal();
  },
  toMore(e){
    wx.navigateTo({url:"/pages/activityMore/index"})
  },
  inviteVisitor(e){
    console.log("邀请访客")

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
