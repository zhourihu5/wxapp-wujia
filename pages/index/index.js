
const app = getApp()
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
var interval = null //倒计时函数
Page({
  data: {
    y:util.rpxToPx(40),
    CustomBar: app.globalData.CustomBar,
    getCodeText:'获取验证码',
    isBindEnabled:false,
    modalName:"ModalGuideInvite,ModalBindPhone,ModalGuideMore,ModalGuideOpen,",
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
  },
  customData: {
    y: 0,
    phone:null,
    code:null,
  },
  bindPhone: function(e) {
    console.log("bindphone");


    this.hideModal();
    this.showGuideInvite();

  },
  moveChangedOpen(e){
    console.log(e)
    // event.detail = {x, y, source}
    if(e.detail.source){//表示非setdata改变的
      this.customData.y=e.detail.y;

    }
  },
  touchendOpen(e){
    console.log(e)
    console.log(this.customData)
    if(this.customData.y<util.rpxToPx(20)){
      //todo 请求开锁接口，成功后回弹
      this.setData({// 回弹
        y:util.rpxToPx(40),
      })
    }else {

    }
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
    this.showOrHideBindPhone();
  },
  showOrHideBindPhone: function () {
    const that=this
    wx.login({
      success (res) {
        if (res.code) {
          console.log('微信登录成功')
          console.log(res)
          //发起网络请求
          network.requestGet(app.url+'/wx/binding/checkBinding', {
            code: res.code
          }, function (data) {
            // {userInfo: null, openid: "oO7s75Bcpea7v0XEqInXMNK87H1A", token: null}
              wx.setStorageSync('wj_user',data.userInfo);
              if(!data.userInfo){
                that.enableTabBar(false)
                that.showModal('ModalBindPhone');
              }else {
                that.enableTabBar(true)
                that.hideModal();
              }
          }, function (msg) {

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
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
  phoneInput(e){
    this.customData.phone=e.detail.value
    this.verifyCodeAndPhone()
  },
  codeInput(e){
    this.customData.code=e.detail.value
    this.verifyCodeAndPhone()
  },
  verifyCodeAndPhone(){
    if(this.customData.code&&this.customData.phone){
      this.setData({
        isBindEnabled:util.isTel(this.customData.phone),
      })

      return
    }
    this.setData({
      isBindEnabled:false,
    })
  },


  getVcode(e){
    const that=this;
    if(that.data.getCodeText!='获取验证码'){
      return
    }
    if(!util.isTel(this.customData.phone)){
      app.showToast("请输入正确的手机号")
      return;
    }

    var currentTime =61
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
    network.requestGet(app.url+'/wx/binding/sendMsg', {
      userName: that.customData.phone
    }, function (data) {
      // {userInfo: null, openid: "oO7s75Bcpea7v0XEqInXMNK87H1A", token: null}
      wx.setStorageSync('wj_user',data.userInfo);
      if(!data.userInfo){
        that.enableTabBar(false)
        that.showModal('ModalBindPhone');
      }else {
        that.enableTabBar(true)
        that.hideModal();
      }
    }, function (msg) {

    })
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
})
