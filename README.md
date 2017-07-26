# Barbers
This simple system aims to implement a waiting queue for Barber's based on WeChat APIs.

# Structure
barbers_server.js由两个部分组成：对WeChat API的响应部分与对浏览器访问的响应部分。

浏览器访问响应包括了静态HTML表单下发以及针对浏览器上socket.io链接响应

静态表单下发由Express框架响应GET请求
socket.io链接由socket.io事件响应部分组成
