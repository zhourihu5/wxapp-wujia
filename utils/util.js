const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function desensitization(phone) {
  var pat=/(\d{3})\d*(\d{4})/
  return  phone.replace(pat,'$1****$2')
}
function calcRemainTime(pDate) {//
  // console.log('date 数据类型')
  // var date= new Date()
  // console.log(typeof date)
  // console.log(date instanceof Date)
  // console.log('2019-03-21' instanceof Date)



  var endDate=null
  if (typeof pDate == "string") {
    endDate = new Date(Date.parse(pDate.replace(/-/g, "/")));
  } else if (typeof pDate == 'number') {
    endDate = new Date(pDate);
  }else if(pDate instanceof Date){
    endDate = pDate;
  }else {
    return pDate
  }
  var now = new Date();
  var milli = endDate.getTime() - now.getTime()
  if (milli <= 0) {
    return '00:00:00'
  }
  var hour = Math.floor(milli / 1000 / 3600)
  var minute = Math.floor(milli % (3600 * 1000) / (60 * 1000))
  var second = Math.floor(milli % (1000 * 60) / 1000)

  hour=formatNumber(hour)
  minute=formatNumber(minute)
  second=formatNumber(second)

  return `${hour}:${minute}:${second}`
}

const app = getApp()
function rpxToPx(x){
  return  x*app.globalData.windowWidth/750;
}
function lowerThreshold(){
  return  rpxToPx(98);
}
function isTel(value){
  var reg = /^((13\d|14[57]|15\d|16\d|17[13678]|18\d)\d{8}|170\d{8})$/;
  if (reg.test(value) === false) {
    return false;
  }
  return true;
}
function customTabBarHeight(){
  if (app.isCustomTabBar) {
    return rpxToPx(98)
  }
  return 0
}
function getCurrentActiveTab(){
  console.log('获取当前tab')
  var pages=getCurrentPages()
  console.log(pages)
  if(!pages){
    return 0
  }
  if(pages.length==0){
    return 0
  }
  var currentPage=pages[pages.length-1]
  var list=[
    {
      "pagePath": "/pages/index/index",
      // "text": "首页",
      // "iconPath": "/images/tab_home.png",
      // "selectedIconPath": "/images/tab_home_selected.png"
    },
    {
      "pagePath": "/pages/order/index",
      // "text": "订单",
      // "iconPath": "/images/tab_order.png",
      // "selectedIconPath": "/images/tab_order_selected.png"
    },
    {
      "pagePath": "/pages/msg/index",
      // "text": "消息",
      // "iconPath": "/images/tab_msg.png",
      // "selectedIconPath": "/images/tab_msg_selected.png"
    },
    {
      "pagePath": "/pages/ucenter/index",
      // "text": "我的",
      // "iconPath": "/images/tab_my.png",
      // "selectedIconPath": "/images/tab_my_selected.png"
    }
  ]
  return  list.findIndex(item => item.pagePath === `/${currentPage.route}`)
}

/**
 *
 * @param pagePath 要定位的页面
 * @param url 要定位的页面重新启动的url
 */
var timer=null
var naviSuccess=false
function navibackTo(url){

  var pagePath=url
  if(url.indexOf("?") != -1){
    pagePath = url.split("?")[0];
  }

  var pages=getCurrentPages()
  var i=0
  for(i=0;i<pages.length;i++){
    if(`/${pages[i].route}`==pagePath){
      break
    }
  }
  if(i<pages.length){
    console.log('navibackTo find it')
    naviSuccess=false
    wx.navigateBack({
      delta:pages.length-i,
      success(res) {
        console.log('wx.navigateBack success',res)
        wx.navigateTo({
          url:url||pagePath,
          success(res){
            naviSuccess=true
            console.log('wx.navigateTo success',res)
          }
        })
      }
    })
    timer&&clearTimeout(timer)
    timer=setTimeout(function () {
      if(!naviSuccess){
        wx.navigateTo({
          url:url||pagePath,
          success(res){
            console.log('setTimeout wx.navigateBack success',res)
          }
        })
      }else {
        console.log('setTimeout do nothing')
      }
      naviSuccess=null
    },500)
    return true
  }else {
    return false
    // wx.navigateTo({
    //   url:url||pagePath
    // })
  }
}
function accSub(num1, num2) {
  let r1;
  let r2;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = Math.pow(10, Math.max(r1, r2));
  const n = (r1 >= r2) ? r1 : r2;
  return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
}


module.exports = {
  // formatTime: formatTime,
  getCurrentActiveTab:getCurrentActiveTab,
  formatDate:formatDate,
  navibackTo:navibackTo,
  calcRemainTime:calcRemainTime,
  desensitization:desensitization,
  rpxToPx:rpxToPx,
  isTel:isTel,
  lowerThreshold:lowerThreshold,
  customTabBarHeight:customTabBarHeight,
  accSub:accSub,
}
