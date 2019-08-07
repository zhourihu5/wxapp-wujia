/**
 * 注册下拉刷新上拉加载更多
 * context 为调用页面
 * json为注册回调事件
 */
function register(context,json){
  context.setData({
    pull: true,//true 下拉刷新状态或者上拉加载更多状态   false 释放
    loading: false,//是否在加载中  
    refreshing_text: '下拉刷新',
    loading_text: '上拉加载更多',
    loadingHeight: 48,//正在加载时高度
    refreshHeight: 0,//刷新布局高度  
    loadMoreHeight: 0,//加载更多布局高度
    scrolling: false,//滚动中
    isUpper: true,
    isLower: false,
    windowHeight: 603,//获取屏幕高度  
    downY: 0,//触摸时Y轴坐标 
    end:true//touchEnd 
  });
  //获取屏幕高度  
  wx.getSystemInfo({
    success: function (res) {
      context.setData({
        windowHeight: res.windowHeight
      })
      console.log("屏幕高度: " + res.windowHeight);
      context.data.loadingHeight = res.windowHeight * 0.08;
    }
  });
  context.move = function(e){
    move(context,e);
  }
  context.scroll = function(e){
    scroll(context,e);
  }
  context.lower = function (e) {
    lower(context,e);
  }
  context.upper = function (e) {
    upper(context,e);
  }
  context.start = function (e) {
    start(context,e);
  }
  context.end = function (e) {
    end(context,e);
  }
}

function scroll (context){
  console.log("scroll...");
  if(context.data.end && context.data.isLower ){//如果快速拖动 然后释放 会在end后继续scroll 
  //可能出现scroll到顶点后依然走scroll方法
    return;
  }
  if (context.data.end && context.data.isUpper){
    return;
  }
  context.data.scrolling = true;
  context.data.isUpper = false;
  context.data.isLower = false;

}
//上拉  滚动条 滚动到底部时触发
function lower (context) {
  console.log("lower...")
  context.data.end = true;
  context.data.isLower = true;
  context.data.scrolling = false;

}
//下拉  滚动条 滚动顶底部时触发
function upper (context) {
  console.log("upper....");
  context.data.end = true;
  context.data.isUpper = true;
  context.data.scrolling = false;
}
function start(context,e) {
  context.data.end = false;
  console.log('start ');
  if (context.data.scrolling || context.data.loading) {
    return;
  }
  var startPoint = e.touches[0]
  var clientY = startPoint.clientY;
  context.setData({
    downY: clientY,
    refreshHeight: 0,
    loadMoreHeight: 0,
    pull: true,
    refreshing_text: '下拉刷新',
    loading_text: '上拉加载更多'
  });
}
function end(context,e) {
  context.data.end = true;
  context.data.scrolling = false;
  if (context.data.refreshing) {
    return;
  }
  console.log('end');
  //释放开始刷新
  var height = context.data.loadingHeight;
  if (context.data.refreshHeight > context.data.loadingHeight) {
    context.setData({
      refreshHeight: height,
      loading: true,
      pull: false,
      refreshing_text: '正在刷新...'
    });
    context.refresh();
  } else if (context.data.loadMoreHeight > height) {
    context.setData({
      loadMoreHeight: height,
      loading: true,
      pull: false,
      loading_text: '正在加载更多...'
    });
    context.loadMore();
  } else {
    context.setData({
      refreshHeight: 0,
      loadMoreHeight: 0,
      loading: false,
      pull: true
    })
  }

}

function loadFinish(context,success) {
  if(!context){
    console.log('please add context');
    return;
  }
  if(success){
    context.setData({
      refreshing_text: '刷新成功',
      loading_text: '加载成功'
    });
  }else{
    context.setData({
      refreshing_text: '刷新失败',
      loading_text: '加载失败'
    });
  }
  setTimeout(function () {
    //2s后刷新结束
    context.setData({
      refreshHeight: 0,
      loadMoreHeight: 0,
      loading: false
    });

  }, 500);
}
function cancel(context) {
  if(!context){
    console.log('please add context');
    return;
  }
  context.setData({
    refreshHeight: 0,
    loadMoreHeight: 0,
    loading: false
  });
}


function move(context,e) {
  console.log("move:", "isUpper = "+context.data.isUpper + "  isLower = "+context.data.isLower+ " scrolling = "+context.data.scrolling);
  if (context.data.scrolling){
    return;
  }
  if (context.data.loading) {
    return;
  }
  var movePoint = e.changedTouches[0];

  var moveY = (movePoint.clientY - context.data.downY) * 0.5;
    console.log("moveY = ", moveY);
  if (Math.abs(moveY) > context.data.loadingHeight * 3) {
    return;
  }
  //1.下拉刷新
  if (context.data.isUpper && moveY > 0) {
    //console.log("下拉...dy:", moveY);
    context.setData({
      refreshHeight: moveY
    })
    if (context.data.refreshHeight > context.data.loadingHeight) {
      context.setData({
        pull: false,
        refreshing_text: '释放立即刷新'
      })
    } else {
      context.setData({
        pull: true,
        refreshing_text: '下拉刷新'
      })
    }
  } else if (context.data.isLower && moveY < 0) {//2上拉加载更多
    //console.log("上拉...dy:", moveY);
    context.setData({
      loadMoreHeight: Math.abs(moveY)
    })
    if (context.data.loadMoreHeight > context.data.loadingHeight) {
      context.setData({
        pull: false,
        loading_text: '释放加载更多'
      })
    } else {
      context.setData({
        pull: true,
        refreshing_text: '上拉加载更多'
      })
    }
  }else{
    console.log("moveY", moveY);   
  }
}
module.exports = {
  register: register,
  loadFinish: loadFinish,
  cancel: cancel,
}