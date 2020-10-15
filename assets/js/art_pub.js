$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgUrl = URL.createObjectURL(files[0])
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options)
    })

    var artState = '已发布'
    $('#btnSave2').on('click', function () {
        artState = '草稿';
    })

    $('#form-pub').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        //基于form表单,创建一个formData对象
        var fd = new FormData($(this)[0]);
        //将文章的发布状态加入到fd中
        fd.append('state', artState);

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意:如果向服务器提交的是 FormData 格式的数据
            //必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!');
                //发布
                location.href = '/article/art_list.html '
            }
        })
    }
})