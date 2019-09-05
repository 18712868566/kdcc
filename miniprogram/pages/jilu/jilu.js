//jilu.js
const app = getApp();
Page({
    data: {
        item: null,
        openid: null
    },
    onLoad: function(options) {

        var that = this;
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)
                console.log(res.result.openid);
                wx.showToast({
                    title: '加载中',
                    icon: 'loading',
                    duration: 2000
                });
                // 初始化数据库
                const db = wx.cloud.database();
                db.collection('todos').where({
                        _openid: res.result.openid, //获取对应openid的数据
                        done: false
                    })
                    .get({
                        success: function(res) {
                            // res.data 是包含以上定义的两条记录的数组
                            // console.log(res.data)
                            // 取回的数据进行去重操作
                            var Array = res.data;
                            var index = 0;
                            var z = Array[index].no;
                            var result = Array[0].no.replace(/\"/g, "");
                            console.log(z)
                            for (var i = 1; i < Array.length; i++) {
                                var y = Array[i].no
                                console.log(y)
                                if (z == y) {
                                    continue;
                                } else {
                                    var x = y.replace(/\"/g, "")
                                    result = result + "," + x;

                                    result = result.split(",")
                                }
                            }

                            that.setData({
                                item: result
                            });

                            wx.showToast({
                                title: '成功',
                                icon: 'success',
                                duration: 2000
                            });

                        },
                        fail: function(err) {
                            //失败执行
                        }
                    });
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
                wx.navigateTo({
                    url: '../deployFunctions/deployFunctions',
                })
            }
        });


    }
});