var socket = io.connect();

$(document).ready(function () {

    $('#submit').on('click',function(){
        var name = $('#name').val();
        var tel = $('#telnumber').val();
        var sex = $('#sex').val();
        var service = $('#service_type').val();
        var remark = $('#remarks').val();
        var id = $('#wechat_openid').text();
        if (name != '' && tel != '') {
            socket.emit('joinQueue',{name:name,sex:sex,tel:tel,seriveType:service,remark:remark,openid:id});
        }
        else {
            alert('Incomplete info!');
        }
    });

    socket.on('joinResult',(result) => {
        if (result.success) {
            // TODO: implement redirection

            alert('Success! You are in queue now!');
        } else {
            alert(result.msg);
        }
    });

    socket.on('serviceTypes',(result) => {
        // TODO: implement ui rendering

    });
});
