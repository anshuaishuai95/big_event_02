// $.ajaxPrefilter() 可以在调用 $.get() $.post() $.ajax() 方法之后，立即触发;
//   接收到 ajax 响应以后，也会触动这个方法;

// 开发环境服务器路径地址
let baseURL = 'http://api-breakingnews-web.itheima.net';
// // 测试环境服务器路径地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';
// // 生产环境服务器路径地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';


$.ajaxPrefilter(function (options) {
    // 如果是index.html页面，不需要添加前缀
    // if (options.url === 'http://127.0.0.1:5500/index.html') {
    //     return;
    // }
    // console.log(options);
    //1: 手动为 url 添加路径前缀
    // console.log('http://api-breakingnews-web.itheima.net' + options.url)
    options.url = baseURL + options.url

    // 2: 身份认证 
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //无论是成功还是失败 都会执行的 complete 方法
    options.complete = function (res) {
        // console.log(res.responseJSON);
        // 判断 如果状态码是1  错误信息是身份证认证失败，就阻止登录
        let obj = res.responseJSON
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            //销毁token 跳回登录页面
            localStorage.removeItem('token')
            //拦截登录
            location.href = '/02-login.html'
        }
    }
});

