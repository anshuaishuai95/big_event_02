$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //上传文件
    $('#btnChooseImagr').on('click', function () {
        $('#file').click()
    });

    // 2.选择图片，修改裁剪区域
    $('#file').on('change', function (e) {
        let file = e.target.files[0]
        //根据文件产生一个模拟地址
        if (file == undefined) {
            return layui.layer.msg('头像为必传值')
        }
        let newImgURL = URL.createObjectURL(file)
        //销毁原有图片，设置新路径  重新渲染
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 3.上传头像
    $('#btnUpload').on('click', function () {
        //获取 base64 类型的头像
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        // console.log(dataURL);
        // console.log(typeof dataURL);
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                //更换头像成功
                layui.layer.msg(res.message)
                // 重新渲染头像
                window.parent.getUserInfo()
            }
        })
    })
})