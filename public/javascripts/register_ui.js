// var io = require('socket.io-client');
var socket = io.connect();

$(document).ready(function () {
    socket.emit('hello');

    // $("#testid").val("hello");
    $("#submit").on('click',function(){
        socket.emit('joinQueue',{});
    });
});
