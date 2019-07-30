//index.js
const util = require('../../utils/util.js')
const network = require('../../utils/network.js')
const app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        list:[],

    },
    customData:{
        pageNum:1,
        pageSize:10,
        isLoading:true,
    },
    onLoad: function () {
        this.loadData()

    },
    mockData(){
        this.setData({
            list:[
                {

                },

            ]
        })
    },
    loadData(){
        var that = this
        that.customData.isLoading=true;
        network.requestGet('/v1/activity/findAll',
            {
                pageNum: that.customData.pageNum,
                pageSize: that.customData.pageSize,
            },
            function (data) {
                that.customData.isLoading=false
                if(that.customData.pageNum==1){
                    that.data.list=data.content
                }else {
                    that.data.list.push.apply(that.data.list, data.content);
                }
                that.setData({
                    list:that.data.list
                })
                that.customData.pageNum++
                console.log('list 数据')
                console.log( that.data.list)
            },
            function (msg) {
                that.customData.isLoading=false
            }
        )
    },
    scrolltoupper(e){
    },
    scrolltolower(e){
        var that = this
        if(that.customData.isLoading){
            return
        }
        this.loadData()
    },

})
