$(function () {
    //为 template 定义时间 过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        let dt = new Date(dtStr)


        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    function padZero(num) {
        return num < 10 ? '0' + num : num

    }
    let q = {
        pagenum: 1,    // 是	int	页码值
        pagesize: 2,	// 是	int	每页显示多少条数据
        cate_id: '',  // 否	string	文章分类的 Id
        state: '',   // 否	string	文章的状态，可选值有：已发布、草稿      
    };

    //2  初始化文章列表
    //封装成函数，需要多次调用
    let layer = layui.layer
    initTable()
    function initTable() {
        //发送ajax 获取文章列表数据
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //获取成功 渲染数据到页面
                let htmlStr = template('tpl-table', { data: res.data })
                $('tbody').html(htmlStr)
                renderPage(res.total)

            }
        })
    }
    //3 初始化 分类
    let form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let srt = template('t1', { data: res.data })
                $('[name="cate_id"]').html(srt)
                form.render()
            }
        })
    }
    //4 筛选功能
    $('#form_sh').on('submit', function (e) {
        e.preventDefault()
        //获取 筛选的值
        let state = $('[name=state]').val()
        let cate_id = $('[name=cate_id]').val()
        //赋值给q
        q.state = state;
        q.cate_id = cate_id;
        // console.log(123);
        // 筛选后重新 渲染
        initTable();

    })

    //5.分页
    let laypage = layui.laypage;
    function renderPage(total) {
        // alert(total)
        layui.use('laypage', function () {
            //执行一个laypage实例

            laypage.render({
                elem: 'box', //注意，这里的 test1 是 ID，不用加 # 号
                count: total,
                limit: q.pagesize,
                curr: q.pagenum,//数据总数，从服务端得到

                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5],
                jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数

                    //首次不执行
                    if (!first) {
                        //do something
                        q.pagenum = obj.curr;
                        q.pagesize = obj.limit;
                        initTable()
                    }
                }
            });
        });

    }

    //6.删除
    $('tbody').on('click', '.btn-datele', function () {
        let Id = $(this).attr('data-id')
        //eg1
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + Id,
                data: { Id },
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    //页面汇总 删除按钮个数为1时  页码需大于1
                    if ($('.btn-datele').length == 1 && q.pagenum > 1) q.pagenum--
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})