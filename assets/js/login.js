$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //自定义校验规则
    const {
        form
    } = layui;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd(value) {
            const pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码输入不一致'
            }
        }
    })

    //注册功能
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.post(
            'http://ajax.frontend.itheima.net/api/reguser', {
                username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, function (res) {
                if (res.status !== 0) {
                    return console.log(res.message|| '注册失败');;
                }
                layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
                $('#link_login').click();

        }
        )
    })

    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
          url: 'http://ajax.frontend.itheima.net/api/login',
          method: 'POST',
          // 快速获取表单中的数据
          data: $(this).serialize(),
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('登录失败！')
            }
            layer.msg('登录成功！')
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', res.token)
            // 跳转到后台主页
            location.href = '/index.html'
          }
        })
    })
})