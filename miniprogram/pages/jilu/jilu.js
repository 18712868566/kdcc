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
                // 初始化数据库
                const db = wx.cloud.database();
                db.collection('todos').where({
                        _openid: res.result.openid,
                        done: false
                    })
                    .get({
                        success: function(res) {
                            // res.data 是包含以上定义的两条记录的数组
                            // console.log(res.data)
                            that.setData({
                                item: res.data
                            })
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