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


module.exports = {
  // formatTime: formatTime,
  formatDate:formatDate,
  calcRemainTime:calcRemainTime,
  desensitization:desensitization,
  rpxToPx:rpxToPx,
  isTel:isTel,
  lowerThreshold:lowerThreshold
}
