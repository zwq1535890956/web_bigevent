$(function () {
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getMinutes());



        return `y-m-d  hh:mm:ss`;
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //定义一个查询的参数对象,将来请求数据的时候,
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据,默认每页显示2条
        cate_id: '', //文章分类的 id
        state: '' //文章的发布状态
    }

    initTable();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    initCate();

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                layui.form.render()
            }

        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件,重新渲染表格的数据
        initTable();
    })

    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ["count", "prev", "page", "next", "limit", "refresh", "skip"],
            limits: [1, 2, 3, 4, 5],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }

        })
    }

    $('tbody').on('click', '.btn-delete', function (e) {
        console.log($('#btn-delete'));
        console.log($('.btn-delete'));
        debugger;

        var len = $('.btn-delete').length;
        console.log(len);
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        console.log(q.pagenum);
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    console.log(q.pagenum);
                    initTable();
                }

            })
            layer.close(index);
        });
    })
})