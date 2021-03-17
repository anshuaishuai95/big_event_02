$(function () {
    let form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 1 || value.trim().length > 6) {
                return '昵称的长度为1~6之间'
            }

        }
    })
    //展示用户信息 （后面需要多次调用 所有封装成函数）
    //导出layer
    let layer = layui.layer
    initUserInfo()
    function initUserInfo() {
        //发送ajax
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(123, res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                //获取用户信息成功,渲染到页面
                form.val('formUserInfo', res.data)
            }
        })
    }
    //重置
    $('#btnReset').on('click', function (e) {
        // 阻止默认提交
        e.preventDefault()
        //重置ajax发送过来的数据
        initUserInfo();
    })
    //修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                // 判断
                if (res.status != 0) {
                    return layer.msg(res.message, { cion: 5 })

                }
                //修改用户信息成功
                layer.msg('修改成功')
                //调用父页面中的更新通话信息 和头像
                window.parent.getUserInfo()

            }
        })
    })
})