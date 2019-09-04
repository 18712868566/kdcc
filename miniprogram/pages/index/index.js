//index.js
const app = getApp()

Page({
    data: {
        avatarUrl: '',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        mobanData: {
            msg: '您好你的的快递已送达到xxx街道,xxx号楼,请速来取...',
            tips: '备注: EMS用提示语'
        }
    },

    onLoad: function() {
        if (!wx.cloud) {
            wx.redirectTo({
                url: '../chooseLib/chooseLib',
            })
            return
        }

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo
                            })
                        }
                    })
                }
            }
        })

        // 登陆调用云函数
        // this.onMyCloudLogin();
    },
    onMyCloudLogin: function() {
        wx.cloud.callFunction({
                name: 'login',
                data: {
                    a: 3,
                    b: 7
                }
            }).then(res => {
                console.log('成功!');

                console.log(res.result)
            })
            .catch(err => {
                // handle error
                console.log('error');
                console.log(res)
            })
    },
    onGetOpenid: function() {
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)
                app.globalData.openid = res.result.openid
                wx.navigateTo({
                    url: '../userConsole/userConsole',
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
    onLookJiLu: function() {
        wx.navigateTo({
            url: '../jilu/jilu',
        })
    },
    // 上传图片
    doUpload: function() {
        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {

                wx.showLoading({
                    title: '上传中',
                })

                const filePath = res.tempFilePaths[0]

                // 上传图片
                const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
                wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                    success: res => {
                        console.log('[上传文件] 成功：', res)

                        app.globalData.fileID = res.fileID
                        app.globalData.cloudPath = cloudPath
                        app.globalData.imagePath = filePath

                        wx.navigateTo({
                            url: '../storageConsole/storageConsole'
                        })
                    },
                    fail: e => {
                        console.error('[上传文件] 失败：', e)
                        wx.showToast({
                            icon: 'none',
                            title: '上传失败',
                        })
                    },
                    complete: () => {
                        wx.hideLoading()
                    }
                })

            },
            fail: e => {
                console.error(e)
            }
        })
    },

    // 扫一扫 获取快递具体信息
    onSaoSao: function() {
        let _this = this;
        wx.scanCode({
            success(res) {
                // res.result
                console.log(res.result);

                /* _this.setData({
                    getData: res.result
                }); */
                wx.navigateTo({
                    url: '../getInfoData/getInfoData?un=' + res.result,
                    events: {
                        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                        acceptDataFromOpenedPage: function(data) {
                            console.log(data)
                        },
                        someEvent: function(data) {
                            console.log(data)
                        }
                    },
                    success: function(res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'un' })
                    }
                });
                // 快递100手机查询快递API
                /* @nu:查询的快递单号
                    @coname: 接入方自定义
                    https://m.kuaidi100.com/app/query/?nu=9895865503892&coname=cdcc
                */
            }
        })
    }
})