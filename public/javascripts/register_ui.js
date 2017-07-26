// const io = require('socket.io-client');
var socket = io();

$(document).ready(function {
    socket.emit('hello');
    // $("#submit").on('click',function(){
    //     socket.emit('joinQueue',{});
    // });
}
