//index.js
//获取应用实例
const app = getApp()
const network = require('../../utils/network.js')
const util = require('../../utils/util.js')
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    pickerValue: [0, 0, 0],
    modalName:null,
    currentArea:null,//展示
    apiAreaData:null,
    apiSearchData:null,
    pageNum:1,
    pageSize:10,
    searchText:'',
    hasNextPage:true,
    isLoadingSearch:false,
    lowerThreshold:util.lowerThreshold(),
    currentCommunity:null,
  },
  onLoad: function () {
    this.loadAreaData()
  },
  loadAreaData(){
    var that=this
    network.requestGet('/area/all',{},function (data) {
      that.setData({
        apiAreaData:data,
      })
    },function (msg) {

    })
  },
  search(e){
    this.data.searchText= e.detail.value;
    this.data.pageNum=1
    this.data.hasNextPage=true
    this.setData({
      apiSearchData:null
    })
    this.loadSearchData()


  },
  loadSearchData(){
    if(!this.data.hasNextPage){
      return
    }
    this.data.isLoading=true
    var that=this
    var val=that.data.pickerValue
    var areaCode=that.data.currentArea?that.data.apiAreaData[val[0]].children[val[1]].children[val[2]].id:''
    network.requestGet('/v1/communtityInfo/findByAreaCodeAndName',{
      areaCode:areaCode,
      name:that.data.searchText,
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize,
    },function (data) {
      if(that.data.pageNum==1){
        that.data.apiSearchData=[]
      }
      that.data.apiSearchData.push.apply(that.data.apiSearchData,data.content)
      that.setData({
        apiSearchData:that.data.apiSearchData,
      })
      if(data.length>=that.data.pageSize){
        that.pageNum++
        this.data.hasNextPage=true
      }else {
        this.data.hasNextPage=false
      }
      that.data.isLoading=false
    },function (msg) {
      that.data.isLoading=false
    })
  },
  itemClicked(e){
    var index=e.currentTarget.dataset.index
    this.data.currentCommunity=this.data.apiSearchData[index]
    wx.navigateTo({
      url:'/pages/applySubmit/index'
    })
  },
  scrolltolower(e){
    if(!this.data.hasNextPage){
      return
    }
    if(this.data.isLoading){
      return;
    }
    this.loadData()
  },
  showModal(e){
    this.setData({
      modalName:'bottomModal',
    })
  },
  hideModal(e){
    this.setData({
      modalName:null,
    })
  },
  pickerChange: function (e) {

    const val = e.detail.value
    this.data.currentArea=this.data.apiAreaData[val[0]].children[val[1]].children[val[2]].areaName
    this.setData({
      pickerValue:val,
      currentArea:this.data.currentArea
    })
  },
})
