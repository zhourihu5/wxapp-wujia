//index.js
const network = require('../../utils/network.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        modalName: 'bottomModal',
        communityList: null,
        currentCommunity: null,
        value: [0,],//社区位置
        valueTmp:[0,],
        flagList: null,
        sex: null,
        receiveName: null,
        phone: null,
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
        communtityId:null,
        currentAddr:null,
        isClicked:false,
        tabLineWidth:util.rpxToPx(28),
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
        var currentAddr= prePage.data.currentAddr
        console.log('prepage.currentAddr')
        console.log(currentAddr)
        // name: that.data.receiveName,
        //     phone: that.data.phone,
        //     sex: that.data.sex,
        //     address: that.data.showAddress,
        //     province: that.data.currentCommunity.province,
        //     city: that.data.currentCommunity.city,
        //     area: that.data.currentCommunity.area,
        //     communtityId: that.data.currentCommunity.id,
        this.data.currentAddr=currentAddr
        this.data.communtityId=currentAddr.communtityId
        this.setData({
            receiveName:currentAddr.name,
            sex:currentAddr.sex,
            phone:currentAddr.phone,
            showAddress:currentAddr.address,
        })

        var that = this
        network.requestGet('/v1/address/findCommuntity', {}, function (data) {

            that.data.communityList = data
            console.log('communityList数据')
            console.log(that.data.communityList)
            for (let i = 0; i < data.length; i++) {
                if(data[i].id==that.data.communtityId){
                    that.data.currentCommunity=data[i]
                    break
                }
            }
            that.setData({
                communityList: that.data.communityList,
                currentCommunity: that.data.currentCommunity
            })
            that.data.flagList = that.data.currentCommunity.flag.split('-')
            that.loadAddrData()
        }, function (msg) {
        })
    },
    phoneInput(e) {
        this.data.phone = e.detail.value
        this.canClickSave()
    },
    nameInput(e) {
        this.data.receiveName = e.detail.value
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
            that.canClickSave()
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
            return;
        }
        this.data.currentCode = this.data.tabs[this.data.active].data[index].code
        this.data.tabs[this.data.active].selected = index
        if (this.data.flagList.length == this.data.active + 1) {
            this.hideModal()
            var showAddress = ''
            var item = null
            var i = 0
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
        if (this.data.sex && this.data.receiveName && this.data.phone && this.data.showAddress && this.data.currentCommunity) {
            if (util.isTel(this.data.phone)) {
                isBtnEnabled = true
            } else {
                app.showToast('请填写正确的手机号')
            }
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
    bindChange: function (e) {
        const that = this
        const val = e.detail.value
        this.data.valueTmp=val

    },
    pickerConfirm(e){
        this.hideModal()
        var that=this
        var val=this.data.valueTmp
        if(!val){
            return
        }
        if (that.data.communityList[val[0]].id != that.data.currentCommunity.id) {
            this.setData({
                showAddress: null,
                tabs: [
                    {
                        title: "请选择",
                        data: [],
                        selected: null,
                    },

                ]
            })
        }
        this.setData({
            value: val,
            currentCommunity: that.data.communityList[val[0]]
        })
        that.data.flagList = that.data.currentCommunity.flag.split('-')
        this.canClickSave()
    },
    onChangeRadio(event) {
        this.setData({
            sex: event.detail
        });
        this.canClickSave()
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
        network.requestPost('/v1/address/saveAddress', {
            name: that.data.receiveName,
            phone: that.data.phone,
            sex: that.data.sex,
            address: that.data.showAddress,
            province: that.data.currentCommunity.province,
            city: that.data.currentCommunity.city,
            area: that.data.currentCommunity.area,
            communtityId: that.data.currentCommunity.id,
            communtityName: that.data.currentCommunity.name,
            id:that.data.currentAddr.id,

        }, function (data) {
            that.data.isClicked=false
            var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
            // var currentPage  = pages[pages.length - 1]  //当前界面
            var prePage = pages[pages.length - 2]  //上一个界面
            prePage.notifyAddressChanged()
            app.showToast('保存成功')
            wx.navigateBack({
                delta: 1
            });
        }, function (msg) {
            that.data.isClicked=false
        })

    },
    showModalCommnunity(e) {
        this.setData({
            modalName: 'communityModal'
        })
    },
    showModalDoorNum(e) {
        this.setData({
            modalName: 'doorNumModal'
        })
    },
    hideModal() {
        this.setData({
            modalName: null
        })
    }
})
