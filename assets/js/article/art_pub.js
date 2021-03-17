$(function () {
    //1. 初始化分类
    let form = layui.form //导出form
    let layer = layui.layer //导出layer
    initCate()
    //2.封装成函数  后续多次调用
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //赋值 渲染
                let htmlStr = template('t1', { data: res.data })
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }
    //3.初始化富文本编辑器

    initEditor()

    //4: // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //4.
    $('#btn1').on('click', function () {
        $('#file').click()
    })

    //5 设置图片
    $('#file').change(function (e) {
        //拿到用户选择的文件
        let file = e.target.files[0]
        //非空校验  
        if (file == undefined) return
        //根据选择的文件 创建一个等一下的URL 地址
        let newImgURL = URL.createObjectURL(file)
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image.cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    //6 发布
    let state = '已发布';
    // $('#btnSa1').on('click', function () {
    //     state = '已发布'
    //     // console.log(2222);
    // })
    $('#btnSa2').on('click', function () {
        state = '草稿'
        // console.log(111);
    })

    //7 添加文章
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        //创建一个 FD 对象 收集数据
        let fd = new FormData(this);
        //放入对象
        fd.append('state', state);
        //放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // console.log(...fd);
                publisArticle(fd)
            });
    })
    //封装，添加文章的方法
    function publisArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 发布成功 跳转
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.querySelector('#list_aa').click()
                }, 1000)


            }
        })
    }
})