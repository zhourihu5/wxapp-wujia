//index.js
const network = require('../../../utils/network.js')
const util = require('../../../utils/util.js')
const app=getApp()
Page({
    data: {
        pageNum:1,
        pageSize:10,
        apiData:[],
        reachBottom:false,
        isLoading:false,
        isOver:false,
        typeNo:null,
        typeName:null,
        lowerThreshold: util.lowerThreshold(),
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
        network.requestPost('/v1/message/updateIsRead',{messageId:messageId},function (data) {
            that.data.apiData[index].isRead=1

        },function (msg) {

        })
    },
    onLoad(option){
        this.data.typeNo=option.typeNo
        this.setData({
            typeName:option.typeName
        })
        this.loadData()
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
            if(that.pageNum==1){
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
        },function (msg) {
            that.data.isLoading=false
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
