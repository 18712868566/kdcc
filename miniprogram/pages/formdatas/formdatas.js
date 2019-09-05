//formdatas.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        msg: '',
        tips: '',
        useropid: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)
                app.globalData.openid = res.result.openid;
                this.setData({
                    useropid: res.result.openid
                })
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
                wx.navigateTo({
                    url: '../deployFunctions/deployFunctions',
                })
            }
        })

    },
    // 获取msg
    getUserMsg: function(e) {
        this.setData({
            msg: e.detail.value
        })
    },
    // 获取tips
    getUserTips: function(e) {
        this.setData({
            tips: e.detail.value
        })
    },
    /**
    提交信息到数据库表名users
    */
    updata: function(e) {
        let that = this;

        if (this.data.msg != '') {

            // 如未填写平台信息 指定默认值
            if (this.data.tips == '') {
                that.setData({
                    tips: '全平台通用'
                })
            }
            // 初始化数据库
            const db = wx.cloud.database();
            // 插入数据
            db.collection('users').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                    // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                    msg: this.data.msg,
                    tips: this.data.tips,
                    pushuser: {
                        id: this.data.useropid
                    },
                    due: new Date(),
                    done: false
                },
                success: function(res) {
                    // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                    wx.showToast({
                        title: '添加成功!',
                        icon: 'success',
                        duration: 2000
                    });

                    wx.navigateBack({
                        delta: 2
                    });
                    console.log(res)
                }
            })
        } else {
            wx.showToast({
                title: '请输入要保存的信息模板',
                icon: 'none',
                duration: 2000
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }

})