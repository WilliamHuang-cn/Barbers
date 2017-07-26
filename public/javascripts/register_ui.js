// var io = require('socket.io-client');
var socket = io.connect();

$(document).ready(function () {
    socket.emit('hello');

    // $("#testid").val("hello");
    $("#submit").on('click',function(){
        var name = $("#name").val;
        var tel = $("#telnumber").val;
        var sex = $("#sex").val;
        socket.emit('joinQueue',{name:name,sex:sex,tel:tel});
    });
});
