//index.js
const app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
    },
    onChange(event) {
        const { key } = event.currentTarget.dataset;
        this.setData({
            [key]: event.detail
        });
    },
    addNewAdress(e){
        wx.navigateTo({url:"/pages/addAdress/index"})
    }
})
