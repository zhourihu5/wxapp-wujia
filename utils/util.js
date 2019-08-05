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
  desensitization:desensitization,
  rpxToPx:rpxToPx,
  isTel:isTel,
  lowerThreshold:lowerThreshold
}
