# Barbers
This simple system aims to implement a waiting queue for Barber's based on WeChat APIs.

# Structure
barbers_server.js由两个部分组成：对WeChat API的响应部分与对浏览器访问的响应部分。

浏览器访问响应包括了静态HTML表单下发以及针对浏览器上socket.io链接响应

静态表单下发由Express框架响应GET请求
socket.io链接由socket.io事件响应部分(register_server.js)组成
socket.io事件：
1. 服务端侦听'connection'事件，WeChat openid，发出'serviceTypes'事件把服务信息交给浏览器（待实现）
2. 浏览器侦听'serviceTypes'事件，将服务信息转换为选项（待实现）
3. 浏览器发出'joinQueue'事件，在option中描述用户姓名，电话，服务类型等信息
4. 服务端侦听'joinQueue'事件，把用户加入队列中
