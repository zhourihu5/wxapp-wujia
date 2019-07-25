//index.js
const util = require('../../utils/util.js')
const app = getApp();
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        nodes: "<div style='max-width: 100%'><h1>这是富文本内容h1</h1><span style='color: red'>这是内容span</span>" +
            "<img   src='https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'" +
        'style="max-width:100%;height:auto"'+
            "/>" +
            "</div>"

    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    },

    toConfirmOrder: function(e){
        wx.navigateTo({url:"/pages/orderConfirm/index"})
    },

    adaptRichText: function(richtext){//todo 限制富文本图片不超出屏幕宽度
       return  richtext.replace('<img ', '<img style="max-width:100%;height:auto"')
    }
})
