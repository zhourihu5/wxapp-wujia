//index.js
const util = require('../../utils/util.js')

Page({
    data: {
        items: [
            {
                title: "系统通知",
                msg: "你的作品最多19个字啊啊啊啊啊啊啊啊啊啊啊啊",
                icon: "/images/msg_system.png",
                time: "30分钟前",
                unread: "2",

            },
            {
                title: "社区通知",
                msg: "你的作品《插画小总结》未通过审核",
                icon: "/images/msg_community.png",
                time: "30分钟前",
                unread: "99"
            },
            {
                title: "订单消息",
                msg: "你的作品《插画小总结》未通过审核",
                icon: "/images/msg_order.png",
                time: "30分钟前",
                unread: "999",
                extraClass: "no-border",
            },
        ]
    },
    onShow() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().init()
        }
    },
    onLoad: function () {
    }
})
