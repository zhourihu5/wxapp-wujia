const network = require('../../utils/network.js')
const util = require('../../utils/util.js')
const app = getApp()
const now=new Date()
const start=new Date()
start.setFullYear(now.getFullYear()-120)
start.setMonth(1)
start.setDate(1)

Page({
    data: {
        modalName: null,
        // modalName: 'bottomModal',
        apiData: null,
        // radioChecked:null,
        birthDay: null,
        start:util.formatDate(start),
        end:util.formatDate(now),
        value:util.formatDate(now),
        isBtnEnabled:false,
    },
    pickerChange: function (e) {
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }

        const val = e.detail.value

        this.data.apiData.birthday =val
        this.data.value=val
        this.setData({
            apiData: this.data.apiData,
            value:this.data.value
        })
        this.canClickSave()
    },
    onLoad() {
        var that = this
        network.requestGet('/v1/user/findWxUserInfo', {}, function (data) {
            that.setData({
                apiData: data,
            })
            if(that.data.apiData.birthday){
                that.setData({
                    value:that.data.apiData.birthday
                })
            }
            that.canClickSave()
        }, function (msg) {
            that.setData({
                apiData: {},
            })
            that.canClickSave()
        })
    },
    nickNameInput(e) {
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }
        this.data.apiData.nickName = e.detail.value
        this.canClickSave()
    },
    onChangeSex(event) {
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }
        //todo 在接口请求数据前不允许操作
        console.log("单选按钮改变事件")
        console.log(event)
        this.data.apiData.sex = event.detail
        this.setData({
            apiData: this.data.apiData,
        });
        this.canClickSave()
    },
    canClickSave() {
        var isBtnEnabled = false
        if (this.data.apiData && this.data.apiData.nickName && this.data.apiData.sex && this.data.apiData.birthday) {
            isBtnEnabled = true
        }
        this.setData({
            isBtnEnabled: isBtnEnabled
        })
    },
    onClickSave(e) {
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }
        if(!this.data.isBtnEnabled){
            return;
        }
        //todo 校验合法性
        var that = this
        network.requestPost('/v1/user/updateInfo', {
            birthday: that.data.apiData.birthday,
            nickName: that.data.apiData.nickName,
            sex: that.data.apiData.sex,

        }, function (data) {
            var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
            // var currentPage  = pages[pages.length - 1]  //当前界面
            var prePage = pages[pages.length - 2]  //上一个界面
            prePage.nickNameChanged()
            app.showToast('修改成功')
            wx.navigateBack({
                delta: 1
            })
        }, function (msg) {

        })
    },
    showModal(e) {
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }
        this.setData({
            modalName: 'bottomModal'
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    }
})
