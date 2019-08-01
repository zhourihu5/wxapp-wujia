import _Promise from 'bluebird';


function request(url, data,method, success, fail) {
  this.requestLoading(url, data,method, "", success, fail)
}
function requestGet(url, data, success, fail) {
  this.requestLoading(url, data,'GET', "", success, fail)
}
function requestPost(url, data, success, fail) {
  this.requestLoading(url, data,'POST', "", success, fail)
}

/**
 * @param {Function} fun 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
 */
function Promise(fun, options) {
  options = options || {};
  return new _Promise((resolve, reject) => {
    if (typeof fun !== 'function') {
      reject();
    }
    options.success = resolve;
    options.fail = reject;
    fun(options);
  });
}
const app = getApp()
/* 展示进度条的网络请求
* url:网络请求的url
* params:请求参数
* message:进度条的提示信息
* success:成功的回调函数
* fail：失败的回调
* requestTask:返回一个 requestTask 对象，通过 requestTask，可中断请求任务
*/
function requestLoading(url, data,method, message, successCallBack, failCallBack, completeCallBack = function (res) {}) {
    var session_id = (getApp().globalData.session);
    wx.showNavigationBarLoading();
    if (message != "") {
        wx.showLoading({
            title: message,
        });
    }
    var header=null
    if(url.startsWith("/v1/")){
        header={
            "Authorization":app.token
        }
    }
    var requestTask = wx.request({
        url: app.url+url,
        data: data,
        header:header,
        method: method,
        success: function (res) {
            console.log("请求成功")
            console.log(res)
            wx.hideNavigationBarLoading();
            if (message != "") {
                wx.hideLoading()
            }
            if (200 == res.statusCode) {
                console.log("接口数据：")
                console.log(res.data.data)
                successCallBack(res.data.data);
            } else {
                if(res.data&&res.data.code<0){//token is expired
                    wx.reLaunch({
                        url:'/pages/index/index'
                    })
                    return
                }
                failCallBack(res.data.message||res.errMsg);
            }
        },
        fail: function (res) {
            console.log("请求失败")
            console.log(res)
            wx.hideNavigationBarLoading();
            if (message != "") {
                // setTimeout(function () {
                //   wx.hideLoading()
                // }, 2000);
                wx.hideLoading()
            }
            wx.showModal({
                title:'提示:',
                showCancel:false,
                content:'网络异常~~'
            });
        },
        complete: function (res) {
          completeCallBack(res.data)
        }
  })
  return requestTask;
}
module.exports = {
  Promise: Promise,
  request: request,
    requestGet: requestGet,
    requestPost: requestPost,
  requestLoading: requestLoading
}