//index.js

Page({
    data: {
        active1: [],
    },
    onChange(event) {
        const {key} = event.currentTarget.dataset;
        this.setData({
            [key]: event.detail
        });
    }
})
