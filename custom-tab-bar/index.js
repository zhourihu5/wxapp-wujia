const util = require('../utils/util.js')
Component({
  data: {
    // active:util.getCurrentActiveTab(),
    active:0,//fixme 自定义tabbar 有第一次切换时闪动的问题，官方还未解决
    isEnabled:true,
    thiz:this,
    list: [
      {
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/images/tab_home.png",
        "selectedIconPath": "/images/tab_home_selected.png"
      },
      {
        "pagePath": "/pages/order/index",
        "text": "订单",
        "iconPath": "/images/tab_order.png",
        "selectedIconPath": "/images/tab_order_selected.png"
      },
      {
        "pagePath": "/pages/msg/index",
        "text": "消息",
        "iconPath": "/images/tab_msg.png",
        "selectedIconPath": "/images/tab_msg_selected.png"
      },
      {
        "pagePath": "/pages/ucenter/index",
        "text": "我的",
        "iconPath": "/images/tab_my.png",
        "selectedIconPath": "/images/tab_my_selected.png"
      }
    ]
  },
  properties: {
    isModalMode: {
      type: [Boolean],
      default: false
    },
    activeTab: {
      type: [Number],
      default: 0
    },
  },
  created(){
    console.log('custom-tab-bar created')
    // this.data.active=util.getCurrentActiveTab()
    // this.setData({
    //   active:this.data.active
    // })
    // console.log(this.data)
  },
  invokeByWxs(){
    return getCurrentPages()
  },
  ready(){
    console.log('custom-tab-bar ready')
    // this.setData({
    //   thiz:this,
    // })
    // this.data.active=util.getCurrentActiveTab()
    // this.setData({
    //   active:this.data.active
    // })
    // console.log(this.data)
  },
  methods: {
    onChange(event) {
      this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[event.detail].pagePath,
      });
    },
    NavChange(e) {
      if(!this.data.isEnabled){
        return;
      }
      console.log(e);
      if(e.currentTarget.dataset.active==this.data.active){
        console.log("没有切换tab");
        return;
      }

      const data = e.currentTarget.dataset
      const url = this.data.list[data.active].pagePath
      this.setData({
        active: data.active
      })
      var that=this
      wx.switchTab({
        url:url,
        success(res) {
          that.setData({
            active: data.active
          })
        }
      })
      console.log("当前tab");
      console.log(this.data.active);

    },
    init() {
      const page = getCurrentPages().pop();
      console.log(page);
      this.setData({
        active: this.data.list.findIndex(item => item.pagePath === `/${page.route}`)
      });
      console.log(this.data.active);
    },
    enable(enabled){
      this.setData({
        isEnabled: enabled
      })
    }

  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log("lifetimes attached")
      // console.log(this)
      // this.setData({
      //   active:util.getCurrentActiveTab(),
      // })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      console.log("lifetimes detached")
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
    console.log("attached")
    // console.log(this)
    // this.setData({
    //   active:util.getCurrentActiveTab(),
    // })
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
    console.log("detached")
  },
});
