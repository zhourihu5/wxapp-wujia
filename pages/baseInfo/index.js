const date = new Date()
const years = []
const months = []
const days = []
const network = require('../../utils/network.js')
const app = getApp()
for (let i = date.getFullYear() - 100; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(i)
}

for (let i = 1; i <= 31; i++) {
    days.push(i)
}

Page({
    data: {
        modalName: null,
        // modalName: 'bottomModal',
        apiData: null,
        years: years,
        months: months,
        days: days,
        // radioChecked:null,
        birthDay: null,
        value: [9999, 0, 0],
        valueTmp:null,
        isBtnEnabled:false,
    },
    pickerChange: function (e) {
        if (!this.data.apiData) {
            app.showToast('数据正在加载中，请稍等')
            return
        }

        const val = e.detail.value
        this.data.valueTmp=val

    },
    pickerConfirm(e){
        this.hideModal()
        const val = this.data.valueTmp
        if(!val){
            return
        }
        //todo 选择月份时动态改变日的可选范围，判断日期是否合法
        this.data.apiData.birthday = `${this.data.years[val[0]]}-${this.data.months[val[1]]}-${this.data.days[val[2]]}`
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
