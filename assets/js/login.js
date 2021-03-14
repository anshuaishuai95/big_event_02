$(function () {
    $('#link_reg').on('click', function () {
        //点击去注册账号 login-box 盒子隐藏   reg-box盒子显示
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击去登陆 login-box 盒子显示   reg-box 盒子隐藏
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //需求2： 密码验证 自定义layui 校验规则
    // console.log(layui);
    let form = layui.form
    form.verify({
        // 属性是校验规则名称 值是函数或者数组
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            // console.log(value);
            if (value != $('.reg-box input[name=password]').val()) {
                // console.log($('.reg-box input[name=password]').val());
                return '两次输入的密码不一样'
            }
        }
    })

    // 需求3： 注册
    let layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        //阻止默认提交事件
        e.preventDefault();
        //发送ajax
        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val()
            },
            success: (res) => {
                // console.log(123, res);
                //返回状态判断
                if (status != 0) {
                    return layer.msg(res.message, { iocn: 5 })
                }
                //提示成功
                layer.msg(res.message, { icon: 6 });
                //切换回登录模块
                $('#link_login').click();
                //表单清空
                $('#form_reg')[0].reset();
            }
        })
    })


    //  用户登录
    $('#form_login').on('submit', function (e) {
        //阻止默认提交事件
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                //判断是否登录成功
                if (res.status != 0) {
                    return layer.mag(res.message, { icon: 5 })
                }
                //登录成功 跳转页面
                location.href = '/02-index.html';
                // 保存token
                localStorage.setItem('token', res.token)
            }
        })
    })
})