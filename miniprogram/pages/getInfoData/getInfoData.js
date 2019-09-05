//gitinfodata.js
const app = getApp()

Page({

    data: {
        com: null,
        un: null,
        danhao: null,
        infoList: null,
        isStatus: true
    },

    onLoad: function(options) {

        console.log(options.un)
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('acceptDataFromOpenedPage', { data: 'un' });
        eventChannel.emit('someEvent', { data: 'un' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            console.log(data)
        });


        this.setData({
            un: options.un
        });

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000
        });

        var that = this;
        wx.request({
            url: 'https://v.juhe.cn/exp/index?com=auto&senderPhone=&receiverPhone=&dtype=&key=bb97944a2592fa7b131a564ad1f146e1&no=' + options.un, //仅为示例，并非真实的接口地址
            data: {},
            method: 'GET',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success(res) {
                console.log(res);

                if (res.data.resultcode != 200) {
                    that.setData({
                        isStatus: false
                    })

                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '当前口袋查查只支持查询物流信息,更多功能会在之后逐步加入,敬请期待!',
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })

                    return false;
                }
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                });

                that.setData({
                    infoList: res.data.result.list
                });

                // 初始化数据库
                const db = wx.cloud.database();
                db.collection('todos').add({
                    // data 字段表示需新增的 JSON 数据
                    data: {
                        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                        /* 快递单号 */
                        no: res.data.result.no,
                        /* 快递公司名字 */
                        company: res.data.result.company,
                        /* 快递公司log缩写*/
                        com: res.data.result.com,
                        /* 快递运输流程 */
                        list: res.data.result.list,
                        /* 提交时间 */
                        time: new Date(),
                        done: false
                    },
                    success: function(res) {
                        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                        console.log(res)
                    }
                });
            },
            fail: err => {
                // handle error
            }
        })
    }
})