//index.js
const network = require('../../utils/network.js')
const util = require('../../utils/util.js')
const app=getApp()
var register = require('../../refreshview/refreshLoadRegister.js');
Page({
    data: {
        pageNum:1,
        pageSize:20,
        apiData:[],
        reachBottom:false,
        isLoading:false,
        isOver:false,
        typeNo:null,
        typeName:null,
        lowerThreshold: util.lowerThreshold(),
    },
    showNavigationBarLoading(){
        if(this.data.loading){//下拉刷新
            return
        }
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
    onChange(event) {
        console.log('collapseChange')
        var index=event.currentTarget.dataset.index
        this.data.apiData[index].collapseValue=event.detail
        this.setData({
            apiData:this.data.apiData
        })

        if(this.data.apiData[index].isRead!=0){
            return
        }
        let messageId=this.data.apiData[index].id
        var that=this
        network.requestPost('/v1/message/updateWxIsRead',{messageId:messageId},function (data) {
            that.data.apiData[index].isRead=1

        },function (msg) {

        })
    },
    onLoad(option){
        register&&register.register(this)
        this.data.typeNo=option.typeNo
        this.setData({
            typeName:option.typeName
        })
        this.loadData()
    },
    //下拉刷新数据
    refresh:function(){
        this.data.pageNum=1
        this.setData({
            isOver: false,
            reachBottom: false,
        });
        this.loadData();
    },
    loadData(){
        var paramData={
            familyId:app.fid,
            type:this.data.typeNo,
            pageNum:this.data.pageNum,
            pageSize:this.data.pageSize,
        }
        var that=this
        if(that.data.isOver){
            return
        }
        that.data.isLoading=true
        network.requestGet('/v1/message/findListByUserId',paramData,function (data) {
            var i=0;
            for(i=0;i<data.length;i++){
                data[i].collapseValue=[]//默认都不展开
            }
            if(that.data.pageNum==1){
                that.data.apiData=[]
            }
            that.data.apiData.push.apply(that.data.apiData,data.content)
            if(data.content.length>=that.data.passive){
                that.data.isOver=false
                that.data.pageNum++
            }else {
                that.data.isOver=true
            }
            that.setData({
                apiData:that.data.apiData,
            })
            that.data.isLoading=false
            register&&register.loadFinish(that,true)
        },function (msg) {
            that.data.isLoading=false
            register&&register.loadFinish(that,false)
        })
    },
    scrolltolower(e){
        console.log('scrolltolower')
        this.setData({
            reachBottom:true,
        })
        if(this.data.isLoading){
            return
        }
        this.loadData()
    },
})
