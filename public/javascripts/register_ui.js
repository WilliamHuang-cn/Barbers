var socket = io.connect();

$(document).ready(function () {

    $('#submit').on('click',function(){
        var name = $('#name').val();
        var tel = $('#telnumber').val();
        var sex = $('#sex').val();
        var service = $('#service_type').val();
        var remark = $('#remarks').val();
        var id = $('#wechat_openid').text();
        var buttonText = $('#submit').val();
        if (name != '' && tel != '') {
            $('#submit').addClass('weui-btn_loading');
            $('#submit').html('<i class="weui-loading" id="loader"></i>'+buttonText);
            socket.emit('joinQueue',{name:name,sex:sex,tel:tel,seriveType:service,remark:remark,openid:id});
        }
        else {
            alert('Incomplete info!');
        }
    });

    socket.on('joinResult',(result) => {
        $('#submit').removeClass('weui-btn_loading');
        $('#loader').remove();
        if (result.success) {
            alert('Success! You are in queue now!');
            window.location.href = $('#redirect_url').text() || 'success.html';
        } else {
            alert(result.msg);
        }
    });

    socket.on('ModifyResult',(result) => {
        $('#submit').removeClass('weui-btn_loading');
        $('#loader').remove();
        if (result.success) {
            alert('Success! Your information is modified!');
            window.location.href = $('#redirect_url').text() || 'success.html';
        } else {
            alert(result.msg);
        }
    });

    socket.on('serviceTypes',(result) => {
        // TODO: implement ui rendering

    });
});
