
function request(url, data,method, success, fail) {
  this.requestLoading(url, data,method, "", success, fail)
}
function requestGet(url, data, success, fail) {
  this.requestLoading(url, data,'GET', "", success, fail)
}
function requestPost(url, data, success, fail) {
  this.requestLoading(url, data,'POST', "", success, fail)
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
    var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
    var currentPage  = pages[pages.length - 1]  //当前界面
    // var prePage = pages[pages.length - 2]  //上一个界面
    if(currentPage.showNavigationBarLoading){
        currentPage.showNavigationBarLoading()
    }
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
            if(currentPage.hideNavigationBarLoading){
                currentPage.hideNavigationBarLoading()
            }
            if (message != "") {
                wx.hideLoading()
            }
            if (200 == res.statusCode) {
                console.log("接口数据：")
                console.log(res.data.data)
                successCallBack(res.data.data);
            } else {
                app.showToast(res.data.message||res.errMsg)
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
            if(currentPage.hideNavigationBarLoading){
                currentPage.hideNavigationBarLoading()
            }
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
            failCallBack(res.errMsg||res);
        },
        complete: function (res) {
          completeCallBack(res.data)
        }
  })
  return requestTask;
}
module.exports = {
  request: request,
    requestGet: requestGet,
    requestPost: requestPost,
  requestLoading: requestLoading
}