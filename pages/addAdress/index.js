//index.js

Page({
    data: {
        modalName:'bottomModal',
        tabs: [
            {
                title: "全部",
                data:[1,]
            },
            {
                title: "待付款",
                data:[]
            },
            {
                title: "待收获",
                data:[1,2,]
            },
            {
                title: "已收货",
                data:[1,2,3,]
            },
            {
                title: "已过期",
                data:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
            },
        ]
    },
    onChange(event) {
        const { key } = event.currentTarget.dataset;
        this.setData({
            [key]: event.detail
        });
    },
    onClickSave(e){
        //todo
    },
    showModal(e){
        this.setData({
            modalName:'bottomModal'
        })
    },
    hideModal(){
        this.setData({
            modalName:null
        })
    }
})
