// 入口函数
$(function () {
    //需求1  ajax 获取用户信息，渲染到页面
    // 这份功能。后面其他的页面/模块还要用。所以必须设置为全局函数
    getUserInfo()

    //点击退出
    $('#btnLogout').on('click', function () {
        //eg1
        layer.confirm('是否确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //弹窗 销毁token  跳转到登录页面
            localStorage.removeItem('token')
            //退回login页面
            location.href = '/02-login.html'

            layer.close(index);
        });
    })
})


//设置一个函数是全局的 ，后面其他功能要用
function getUserInfo() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        type: 'get',
        // headers: {
        //     //配置头信息。 设置token 剩识别认证
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.message, { icon: 5 })
            }
            //头像和文字渲染
            renderAvatar(res.data)
        }

    })
}
//封装头像，文字渲染
function renderAvatar(user) {
    // 渲染用户名，如果有昵称。就以昵称为准
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎' + name)
    //判断是否有添加头像。如果没有就用文字渲染，
    if (user.user_pic == null) {
        //隐藏头像，渲染文字
        $('.layui-nav-img').hide()
        $('.text-avatar').show().html(name[0].toUpperCase())
    } else {
        //渲染头像。隐藏文字
        $('.layui-nav-img').shou().attr('src', user.user_pic);
        $('.text-avatar').hide()
    }


}