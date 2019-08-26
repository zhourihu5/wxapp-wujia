//index.js
const network = require('../../utils/network.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        modalName: 'bottomModal',
        currentCommunity: null,
        flagList: null,
        applyName: null,
        ownName: null,
        relation: null,
        familyId: null,
        loadingDoorNumData: false,
        active: 0,//选择期区楼等的当前tab
        currentCode: null,
        showAddress: null,
        isBtnEnabled: false,
        tabs: [
            {
                title: "请选择",
                data: [],
                selected: null,
            },

        ],
        isClicked:false,
        tabLineWidth:util.rpxToPx(28),
        relationArr:['家人','租户','其他'],
    },
    showNavigationBarLoading(){
        this.setData({
            navigationBarLoading:true
        })
    },
    hideNavigationBarLoading(){
        this.setData({
            navigationBarLoading:false
        })
    },
    onShareAppMessage: function(res) {
        console.log('onShareAppMessage')
        console.log(res)
        if (res.from === 'button') {//邀请好友
            console.log('button onShareAppMessage')
        }
        return {
            // title: '吾家W+',//默认当前小程序名称
            path: '/pages/index/index' ,
            success: function(res) {
                console.log('onShareAppMessage success')
                console.log(res)
            }
        }
    },
    onLoad() {
        var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
        // var currentPage  = pages[pages.length - 1]  //当前界面
        var prePage = pages[pages.length - 2]  //上一个界面
        this.setData({
            currentCommunity: prePage.data.currentCommunity
        })
        console.log('前一个页面选择的数据')
        console.log(this.data.currentCommunity)
        prePage.data.currentCommunity = null
        this.data.flagList = this.data.currentCommunity.flag.split('-')
        this.loadAddrData()
    },
    // navigateBack(){
    //     wx.navigateBack({
    //         delta:2//跳过小区列表页
    //     })
    // },
    relationInput(e) {
        this.data.relation = e.detail.value
        this.canClickSave()
    },
    relationItemTap(e){
        var index=e.currentTarget.dataset.index
        this.setData({
            relation:this.data.relationArr[index]
        })
        this.canClickSave()
    },
    nameInput(e) {
        this.data.applyName = e.detail.value
        this.canClickSave()
    },
    ownerInput(e) {
        this.data.ownName = e.detail.value
        this.canClickSave()
    },

    loadAddrData() {
        var that = this
        var active = that.data.active
        that.data.loadingDoorNumData = true
        var url = null
        var paramData = null
        if (that.data.flagList[that.data.active] == '期') {
            url = '/v1/issue/findByCommuntity'
            paramData = {commCode: that.data.currentCommunity.code}
        } else if (that.data.flagList[that.data.active] == '区') {
            url = '/v1/district/findByCommuntity'
            paramData = {commCode: that.data.currentCommunity.code}
        } else if (that.data.flagList[that.data.active] == '楼') {
            url = '/v1/floor/findByFloor'
            paramData = {commCode: that.data.currentCommunity.code}
        } else if (that.data.flagList[that.data.active] == '单') {
            url = '/v1/unit/findByUnit'
            paramData = {commCode: that.data.currentCommunity.code, floorCode: that.data.currentCode}
        } else if (that.data.flagList[that.data.active] == '层') {//
            url = '/v1/storey/list'
            paramData = {commCode: that.data.currentCommunity.code, unitCode: that.data.currentCode}
        } else if (that.data.flagList[that.data.active] == '家') {
            url = '/v1/family/getFamilyByStoreyCode';
            paramData = {commCode: that.data.currentCommunity.code, storeyCode: that.data.currentCode}
        }
        network.requestGet(url, paramData, function (data) {
            that.data.loadingDoorNumData = false
            that.data.tabs[active].data = data
            that.setData({
                tabs: that.data.tabs
            })

            console.log('tabData')
            console.log(that.data.tabs)
        }, function (msg) {
            that.data.loadingDoorNumData = false
        })

    },
    itemClicked(e) {//期区楼等的选择点击事件
        var index = e.currentTarget.dataset.index;
        if (!index) {
            console.log(e)
        }
        if (this.data.tabs[this.data.active].selected == index) {
            if (this.data.flagList.length == this.data.active + 1) {
                this.hideModal()
            }else {
                this.data.active++
                this.setData({
                    tabs: this.data.tabs,
                    active: this.data.active
                })
                if(this.data.tabs[this.data.active].data.length<1 ){
                    this.loadAddrData()
                }
            }
            return;
        }




        this.data.familyId = this.data.tabs[this.data.active].data[index].id
        this.data.currentCode = this.data.tabs[this.data.active].data[index].code
        this.data.tabs[this.data.active].selected = index
        if (this.data.flagList.length == this.data.active + 1) {
            this.hideModal()
            var showAddress = this.data.currentCommunity.name
            var i = 0
            var item = null
            for (i = 0; i < this.data.tabs.length; i++) {
                item = this.data.tabs[i]
                showAddress += item.data[item.selected].name
            }
            this.setData({
                showAddress: showAddress,
                tabs: this.data.tabs,
                active: this.data.active,
            })
            this.canClickSave()

            return
        }
        this.data.tabs[this.data.active].title = this.data.tabs[this.data.active].data[index].name
        var i = this.data.tabs.length - 1 - this.data.active
        for (; i > 0; i--) {
            this.data.tabs.pop()
        }
        // if(this.data.tabs[this.data.tabs.length-1].title!="请选择"){
        this.data.tabs.push({
            title: "请选择",
            data: [],
            selected: null,
        })
        // }
        this.data.active++

        this.loadAddrData()
        this.setData({
            tabs: this.data.tabs,
            active: this.data.active
        })
    },
    canClickSave() {
        var isBtnEnabled = false
        if (this.data.applyName && this.data.ownName && this.data.showAddress && this.data.relation) {
            isBtnEnabled = true
        }
        this.setData({
            isBtnEnabled: isBtnEnabled
        })
    },
    tabChange(event) {
        var that = this
        that.data.active = event.detail.index
        if (that.data.tabs[that.data.active].data.length <= 0) {
            that.loadAddrData()
        }

    },
    onClickSave(e) {
        if (!this.data.isBtnEnabled) {
            return
        }
        var that = this
        if(that.data.isClicked){
            return;
        }
        that.data.isClicked=true
        network.requestPost('/v1/apply/applyUnLock', {
            applyName: that.data.applyName,
            ownName: that.data.ownName,
            relation: that.data.relation,
            familyId: that.data.familyId,
            familyName: that.data.showAddress,
        }, function (data) {
            that.data.isClicked=false
            wx.redirectTo({
                url: "/pages/auditWait/index"
            });
        }, function (msg) {
            that.data.isClicked=false
        })

    },
    showModalDoorNum(e) {
        var that=this

        this.setData({
            modalName: 'doorNumModal',
            // tabs: this.data.tabs,
            // active: this.data.active
        })
        //todo 第一次加载时tab 线的宽度计算不对
    },
    hideModal() {
        this.setData({
            modalName: null
        })
    }
})
