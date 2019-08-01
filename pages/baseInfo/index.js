const date = new Date()
const years = []
const months = []
const days = []
const network = require('../../utils/network.js')
for (let i = 1990; i <= date.getFullYear(); i++) {
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
        modalName:'bottomModal',
        apiData:null,
        years: years,
        months: months,
        days: days,
        // radioChecked:null,
        birthDay:null,
        value: [9999, 1, 1],
    },
    bindChange: function (e) {
        if(!this.data.apiData){
            app.showToast('数据正在加载中，请稍等')
            return
        }

        const val = e.detail.value
        //todo 选择月份时动态改变日的可选范围，判断日期是否合法
        this.apiData=this.apiData||{}
        this.apiData.birthday=`${this.data.years[val[0]]}-${this.data.months[val[1]]}-${this.data.days[val[2]]}`
        this.setData({
            apiData:this.data.apiData,
            // year: this.data.years[val[0]],
            // month: this.data.months[val[1]],
            // day: this.data.days[val[2]]
        })
    },
    onLoad(){
        // var that=this
        // network.requestGet('/v1/user/findWxUserInfo',{},function (data) {
        //     that.setData({
        //         apiData:data,
        //     })
        // },function (msg) {
        //
        // })
    },
    onChangeSex(event) {
        if(!this.data.apiData){
            app.showToast('数据正在加载中，请稍等')
            return
        }
        //todo 在接口请求数据前不允许操作
        console.log("单选按钮改变事件")
        console.log(event)
        this.data.apiData.sex=event.detail
        this.setData({
            apiData:this.data.apiData,
        });
    },
    onClickSave(e){
        if(!this.data.apiData){
            app.showToast('数据正在加载中，请稍等')
            return
        }
        //todo 校验合法性
        var that=this
        network.requestPost('/v1/user/updateInfo',{
            birthday:that.apiData.birthday,
            nickName:that.apiData.nickName,
            sex:that.apiData.sex,

        },function (data) {
            app.showToast('修改成功')
        },function (msg) {

        })
    },
    showModal(e){
        if(!this.data.apiData){
            app.showToast('数据正在加载中，请稍等')
            return
        }
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
