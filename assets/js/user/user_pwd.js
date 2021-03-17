//入口函数
$(function () {
    //调出form
    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //新密码
        smaePwd: function (value) {
            //判断 新密码不能与旧密码 重复
            if (value == $('[name=oldPwd]').val()) {
                return '新密码和原密码不能一致'
            }

        },
        //重复新密码
        rePwd: function (value) {
            //判断两次输入的新密码是否一致
            if (value != $('[name=newPwd]').val()) {
                return '两次输入的密码必须保持一致'
            }
            // // 修改成功后
            // layui.layer.msg('修改成功')

        }


    })

    //修改密码
    $('form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                //修改成功后
                layui.layer.msg(res.message)
                //清空密码信息
                $('form')[0].reset()
            }
        })
    })
})