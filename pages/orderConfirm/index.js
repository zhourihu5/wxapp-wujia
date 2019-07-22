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
  }
});