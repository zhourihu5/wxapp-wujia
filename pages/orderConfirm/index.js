Page({
  data: {
    active: 0,
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

  nextStep() {
    this.setData({
      active: ++this.data.active % 4
    });
  },
    toPay(e){
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: 'MD5',
        paySign: '',
        success (res) {wx.navigateTo({url:"/pages/paySuccess/index"}) },
        fail (res) {
          wx.navigateTo({url:"/pages/paySuccess/index"})
        }
      })
        // wx.navigateTo({url:"/pages/paySuccess/index"})
    }
});