var socket = io.connect();

$(document).ready(function () {
    socket.emit('hello');
});
