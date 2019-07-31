Component({

    behaviors: [],

    properties: {
        step1Text: String ,// 简化的定义方式
        step2Text: String ,// 简化的定义方式
        step3Text:String,
        step1Checked:Boolean,
        step2Checked:Boolean,
        step3Checked:Boolean,

    },
    data: {

    }, // 私有数据，可用于模版渲染

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () { },
        moved: function () { },
        detached: function () { },
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
    ready: function() { },

    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () { },
    },

    methods: {
        goBuy(e){
            let id=e.target.dataset.id;
            wx.navigateTo({url:'/pages/goodsDetail/index?id='+id})
        },
        onMyButtonTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
                myProperty: 'Test'
            })
        },
        _myPrivateMethod: function () {
            // 内部方法建议以下划线开头
            this.replaceDataOnPath(['A', 0, 'B'], 'myPrivateData') // 这里将 data.A[0].B 设为 'myPrivateData'
            this.applyDataUpdates()
        },
        _propertyChange: function (newVal, oldVal) {

        }
    }

})