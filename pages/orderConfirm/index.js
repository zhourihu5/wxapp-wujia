const network = require('../../utils/network.js')
const app=getApp()
Page({
  data: {
    apiData: null,
    modalName:null,
    myAddress:null,//收货地址
    steps: [
      {
        text: '参与活动',
        desc: ''
      },
      {
        text: '团购满减',
        desc: ''
      },
      {
        text: '团购截至',
        desc: ''
      },

    ]
  },
  onLoad(query){
    console.log("接收参数")
    console.log(query)
    let that=this
    let id=query.id
    network.requestGet('/v1/activity/isOrder',{activityId:id},function (data) {
      that.setData({
        apiData:data,
      })
    },function (msg) {

    })

  },
  // onShow(){
  //   if(this.data.apiData&& !this.data.apiData.address){
  //     this.data.apiData.address=app.myAddress
  //   }
  //
  // },
  toAddArr(e){
    this.hideModal(e)
    wx.navigateTo({
      url:"/pages/myAdress/index",
    })
  },
  nextStep() {
    this.setData({
      active: ++this.data.active % 4
    });
  },
    toPay(e){
      if(!this.data.apiData.address){
        this.showModal()
        return
      }
      network.requestPost('/v1/order/saveOrder',{},function (data) {

        wx.requestPayment({
          timeStamp: '',
          nonceStr: '',
          package: '',
          signType: 'MD5',
          paySign: '',
          success (res) {wx.navigateTo({url:"/pages/paySuccess/index"}) },
          fail (res) {

          }
        })


      },function (msg) {

      })


        // wx.navigateTo({url:"/pages/paySuccess/index"})
    },
    showModal(){
      this.setData(
          {
            modalName:'ModalAddaddr',
          }
      )
    },
    hideModal(e){
      this.setData(
          {
            modalName:null,
          }
      )
    }
});