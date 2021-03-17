$(function () {
    //1. 添家文章类别，（封装成函数，需要多次调用）
    initAreicleList()
    function initAreicleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                let htmlStr = template('tt', { data: res.data })
                $('tbody').html(htmlStr)
            }
        })

    }

    //2.添加文章类别
    let layer = layui.layer
    $('#btnAdd').on('click', function () {
        // console.log(11);
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#tt2').html()
        });


    })
    // 3. 提交文章分类添加，（事件委托）
    let indexAdd = null
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //添加成功后 重新渲染页面
                initAreicleList()
                layer.msg(res.message)
                // 关闭弹窗
                layer.close(indexAdd)
            }
        })

    })

    // 4. 点击编辑，修改展示表单
    let indexEdit = null
    let form = layui.form
    $('tbody').on('click', '.btn_edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#tt3').html()
        });
        //获取Id  发送ajax获取数据，渲染到页面
        let Id = $(this).attr('data-id')
        // console.log(Id);
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + Id,
            success: (res) => {
                // console.log(123, res);
                form.val('form-edit', res.data)
                // console.log(111, res);
            }
        })
    })

    //5.点击编辑修改 -提交
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                //    console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //修改成功 重新渲染
                initAreicleList()
                layer.msg(res.message)
                layer.close(indexEdit)
            }

        })
    })

    // 6.删除
    $('tbody').on('click', '.btn_detele', function () {
        // 先获取Id 
        let Id = $(this).attr('data-id')
        //是否要删除
        //eg1
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + Id,
                data: { Id },
                success: (res) => {
                    //    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initAreicleList()
                }
            })

            layer.close(index);
        });
    })
})