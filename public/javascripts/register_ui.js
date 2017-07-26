// var io = require('socket.io-client');
var socket = io.connect();

$(document).ready(function () {
    socket.emit('hello');

    // $("#testid").val("hello");
    $("#submit").on('click',function(){
        var name = $("#name").val();
        var tel = $("#telnumber").val();
        var sex = $("#sex").val();
        var service = $("#service_type").val();
        var remark = $("#remarks").val();
        if (name != '' && tel != '') {
            socket.emit('joinQueue',{name:name,sex:sex,tel:tel,seriveType:service,remark:remark});
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
});
